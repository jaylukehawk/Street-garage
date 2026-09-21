import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Camera, ImageUp, LoaderCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "@/components/bookmark-button";
import { RefillSheet } from "@/components/refill-sheet";
import { COLOURS, DEFAULT_MAKE, MAKE_NAMES, modelsFor, nearestMake } from "@/lib/catalog";
import { reverseGeocode } from "@/lib/geocode";
import { identifyVehicle } from "@/lib/identify";
import { prepareScanPhoto, resizeToJpeg } from "@/lib/image";
import { requestPosition } from "@/lib/geo";
import { useGarageStore } from "@/lib/store";
import { scanCap } from "@/lib/ranks";
import { REFILL_PRICE, type IdentifyResult } from "@/lib/types";

export const Route = createFileRoute("/scan")({ component: ScanPage });

type Stage = "live" | "working" | "edit" | "duplicate";

function ScanPage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scansUsedToday = useGarageStore((s) => s.scansUsedToday);
  const sightings = useGarageStore((s) => s.sightings);
  const cap = scanCap(sightings);
  const remaining = Math.max(0, cap - scansUsedToday);
  const addSighting = useGarageStore((s) => s.addSighting);
  const setGps = useGarageStore((s) => s.setGpsPreference);

  const [stage, setStage] = useState<Stage>("live");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [storedPhoto, setStoredPhoto] = useState<string | null>(null);
  const [workMsg, setWorkMsg] = useState("Reading the car");
  const [make, setMake] = useState(DEFAULT_MAKE);
  const [aiLocked, setAiLocked] = useState(false);
  const [model, setModel] = useState(modelsFor(DEFAULT_MAKE)[0] ?? "Fiesta");
  const [colour, setColour] = useState<(typeof COLOURS)[number]>("Silver");
  const [year, setYear] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [refillOpen, setRefillOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [wantFavourite, setWantFavourite] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("Camera is not available here. Upload a photo instead.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }
      } catch {
        setCameraError("Camera permission is off. Upload a photo instead.");
      }
    }
    void start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function runIdentify(source: Blob | string) {
    if (remaining <= 0) {
      setRefillOpen(true);
      return;
    }
    setStage("working");
    setWorkMsg("Blurring plates");
    try {
      const prepared = await prepareScanPhoto(source);
      setPreview(prepared.identify);
      setWorkMsg("Identifying make and model");
      const payload = await resizeToJpeg(prepared.identify, 768, 0.7);
      const identified = await identifyVehicle({ data: { image: payload } });
      let result: IdentifyResult | null = null;
      if (identified.ok) result = identified.result;
      else setNote(identified.error + " Retake the photo.");

      let finalPhoto = prepared.stored;
      if (result?.plateBoxes.length) {
        const again = await prepareScanPhoto(prepared.identify, result.plateBoxes);
        finalPhoto = again.stored;
        setPreview(again.identify);
      }
      setStoredPhoto(finalPhoto);

      if (result && !result.isVehicle) {
        setNote("No vehicle found. Try another photo — this did not spend a scan.");
        setStage("live");
        setPreview(null);
        setStoredPhoto(null);
        toast("No vehicle found");
        return;
      }

      const nextMake = nearestMake(result?.make ?? DEFAULT_MAKE);
      const nextModels = modelsFor(nextMake, result?.model);
      setMake(nextMake);
      setModel(
        result?.model && nextModels.includes(result.model)
          ? result.model
          : (nextModels[0] ?? result?.model ?? ""),
      );
      const colourMatch = COLOURS.find(
        (c) => c.toLowerCase() === (result?.colour ?? "").toLowerCase(),
      );
      setColour(colourMatch ?? "Silver");
      setYear(result?.year ? String(result.year) : "");
      setConfidence(result?.confidence ?? null);
      if (!identified.ok) {
        setNote("Could not auto-identify. Pick make and model, then save.");
      } else {
        setNote(null);
      }
      setAiLocked(Boolean(identified.ok && result?.isVehicle && result.make));
      setStage("edit");
      setWantFavourite(false);
    } catch {
      setStage("live");
      toast("Could not read that photo");
    }
  }

  async function capture() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
    if (blob) void runIdentify(blob);
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    void runIdentify(file);
  }

  async function useSample() {
    void runIdentify("/cars/vw-golf.jpg");
  }

  async function save() {
    if (!storedPhoto || busy) return;
    if (remaining <= 0) {
      setRefillOpen(true);
      return;
    }
    setBusy(true);
    try {
      const pos = await requestPosition();
      setGps(pos ? "granted" : "denied");
      let locationName = pos ? "Near you" : "Location off";
      if (pos) {
        const geo = await reverseGeocode({ data: { lat: pos.lat, lng: pos.lng } });
        locationName = geo.name;
      }
      const yearNum = year.trim() ? Number(year) : null;
      const result = addSighting({
        make,
        model,
        colour,
        year: yearNum && Number.isFinite(yearNum) ? yearNum : null,
        confidence,
        photo: storedPhoto,
        seenAt: new Date().toISOString(),
        lat: pos?.lat ?? null,
        lng: pos?.lng ?? null,
        locationName,
        favourite: wantFavourite,
      });
      if (!result.ok) {
        if (result.reason === "duplicate") {
          setStage("duplicate");
          return;
        }
        setRefillOpen(true);
        return;
      }
      toast(`Logged · ${make} ${model} · +${result.xpGained} XP`);
      navigate({ to: "/history/$id", params: { id: result.sighting.id } });
    } finally {
      setBusy(false);
    }
  }

  const modelOptions = modelsFor(make, model);

  return (
    <main className="relative min-h-full flex-1 bg-navy">
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <button
          type="button"
          className="flex size-12 items-center justify-center rounded-md bg-navy/70 text-fg"
          onClick={() => navigate({ to: "/" })}
          aria-label="Close"
        >
          <X className="size-6" />
        </button>
        <p className="font-display tracking-[0.2em] text-silver">SCAN</p>
        <span className="w-12" />
      </header>

      {stage === "live" || stage === "working" ? (
        <div className="absolute inset-0 bg-navy">
          <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
          {cameraError && stage === "live" ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-navy px-6 text-center">
              <Camera className="size-10 text-silver" />
              <div>
                <p className="font-display text-2xl tracking-wide text-fg">Camera is off</p>
                <p className="mt-2 text-silver">{cameraError}</p>
              </div>
              {remaining > 0 ? (
                <>
                  <Button
                    size="lg"
                    className="mt-2 w-full max-w-sm"
                    onClick={() => fileRef.current?.click()}
                  >
                    <ImageUp className="size-5" />
                    Upload photo
                  </Button>
                  <button
                    type="button"
                    className="min-h-12 text-sm text-muted"
                    onClick={useSample}
                  >
                    Or try a sample
                  </button>
                </>
              ) : (
                <Button size="lg" variant="metal" className="mt-2 w-full max-w-sm" onClick={() => setRefillOpen(true)}>
                  Refill {cap} scans — {REFILL_PRICE}
                </Button>
              )}
              <p className="text-xs text-muted">Plates are blurred. Owners are never looked up.</p>
            </div>
          ) : null}
          {preview && stage === "working" ? (
            <div className="absolute inset-0 overflow-hidden">
              <img src={preview} alt="" className="h-full w-full object-cover" />
              <span className="plate-cover" aria-hidden="true" />
            </div>
          ) : null}
        </div>
      ) : preview ? (
        <div className="absolute inset-x-0 top-0 h-[42%] overflow-hidden">
          <img src={preview} alt="" className="h-full w-full object-cover" />
          <span className="plate-cover" aria-hidden="true" />
        </div>
      ) : null}

      {stage === "working" ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end bg-navy/45 pb-24">
          <div className="flex items-center gap-3 rounded-lg bg-navy/85 px-4 py-3 text-silver">
            <LoaderCircle className="size-5 animate-spin text-primary" />
            {workMsg}
          </div>
        </div>
      ) : null}

      {stage === "live" && !cameraError ? (
        <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-4">
          {remaining <= 0 ? (
            <button
              type="button"
              className="mb-4 min-h-12 w-full rounded-md bg-silver font-display text-lg text-navy"
              onClick={() => setRefillOpen(true)}
            >
              Refill {cap} scans — {REFILL_PRICE}
            </button>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                className="flex size-14 items-center justify-center rounded-md border border-border bg-navy-2"
                onClick={() => fileRef.current?.click()}
                aria-label="Upload photo"
              >
                <ImageUp className="size-6 text-silver" />
              </button>
              <button
                type="button"
                aria-label="Capture"
                disabled={remaining <= 0}
                onClick={capture}
                className="size-20 rounded-full metal-ring p-1.5"
              >
                <span className="block size-full rounded-full bg-fg" />
              </button>
              <button
                type="button"
                className="min-h-14 min-w-14 rounded-md border border-border bg-navy-2 px-2 text-center text-xs text-silver"
                onClick={useSample}
              >
                Sample
              </button>
            </div>
          )}
          <p className="mt-3 text-center text-xs text-muted">
            Plates are blurred. Owners are never looked up.
          </p>
        </div>
      ) : null}

      {stage === "edit" ? (
        <section className="absolute inset-x-0 bottom-0 z-20 max-h-[62%] overflow-y-auto rounded-t-2xl border border-border bg-navy-2 px-5 pb-8 pt-5">
          <div>
            <h1 className="font-display text-3xl tracking-wide">
              {make} {model}
            </h1>
            <p className="text-sm text-muted">
              {colour}
              {year ? ` · ${year}` : ""}
              {confidence != null ? ` · ${Math.round(confidence * 100)}% sure` : ""}
            </p>
          </div>
          {note ? <p className="mt-3 text-sm text-silver">{note}</p> : null}
          {confidence != null ? (
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-navy-3">
              <div className="h-full bg-primary" style={{ width: `${Math.round(confidence * 100)}%` }} />
            </div>
          ) : null}

          <label className="mt-5 block text-xs uppercase tracking-wider text-muted">Make</label>
          <select
            disabled
            className="mt-1 h-12 w-full rounded-md border border-border bg-navy px-3 text-fg"
            value={MAKE_NAMES.includes(make) ? make : "__other"}
            onChange={(e) => {
              const next = e.target.value === "__other" ? make : e.target.value;
              setMake(next);
              setModel(modelsFor(next)[0] ?? "");
            }}
          >
            {MAKE_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
            {!MAKE_NAMES.includes(make) ? <option value="__other">{make}</option> : null}
          </select>

          <label className="mt-4 block text-xs uppercase tracking-wider text-muted">Model</label>
          <select
            disabled
            className="mt-1 h-12 w-full rounded-md border border-border bg-navy px-3 text-fg"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            {modelOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted">Colour</label>
              <select
                className="mt-1 h-12 w-full rounded-md border border-border bg-navy px-3 text-fg"
                value={colour}
                onChange={(e) => setColour(e.target.value as (typeof COLOURS)[number])}
              >
                {COLOURS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted">Year</label>
              <input
                inputMode="numeric"
                className="mt-1 h-12 w-full rounded-md border border-border bg-navy px-3 text-fg"
                placeholder="If known"
                value={year}
                onChange={(e) => setYear(e.target.value.replace(/[^\d]/g, "").slice(0, 4))}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <BookmarkButton
              on={wantFavourite}
              label={wantFavourite ? "Remove favourite" : "Save favourite"}
              onClick={() => setWantFavourite((v) => !v)}
              className="size-14 rounded-lg border border-border bg-navy"
            />
            <Button className="min-w-0 flex-1" size="lg" disabled={busy} onClick={save}>
              {busy ? "Saving" : "Save sighting"}
            </Button>
          </div>
          <Button
            className="mt-3 w-full"
            variant="ghost"
            onClick={() => {
              setStage("live");
              setPreview(null);
              setStoredPhoto(null);
              setWantFavourite(false);
            }}
          >
            Retake
          </Button>
        </section>
      ) : null}

      {stage === "duplicate" ? (
        <section className="absolute inset-x-0 bottom-0 z-20 rounded-t-2xl border border-border bg-navy-2 px-5 py-8 text-center">
          <h1 className="font-display text-3xl tracking-wide">Already logged this one</h1>
          <p className="mt-2 text-sm text-muted">
            Same make, model and spot within 50 metres in the last 2 hours.
          </p>
          <Button className="mt-6 w-full" onClick={() => navigate({ to: "/" })}>
            Back to Scan
          </Button>
          <Button
            className="mt-3 w-full"
            variant="ghost"
            onClick={() => {
              setStage("live");
              setPreview(null);
              setStoredPhoto(null);
              setWantFavourite(false);
            }}
          >
            Scan another
          </Button>
        </section>
      ) : null}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          void onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <RefillSheet open={refillOpen} onOpenChange={setRefillOpen} />
    </main>
  );
}
