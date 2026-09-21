import { createServerFn } from "@tanstack/react-start";
import { nearestMake } from "./catalog";
import type { IdentifyResult, PlateBox } from "./types";

type ApiOk = { ok: true; result: IdentifyResult };
type ApiErr = { ok: false; error: string };

function emptyResult(partial: Partial<IdentifyResult> = {}): IdentifyResult {
  return {
    isVehicle: false,
    make: null,
    model: null,
    colour: null,
    year: null,
    confidence: 0,
    plateBoxes: [],
    ...partial,
  };
}

function parseBoxes(raw: unknown): PlateBox[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((box) => {
      if (!box || typeof box !== "object") return null;
      const b = box as Record<string, unknown>;
      const x = Number(b.x);
      const y = Number(b.y);
      const w = Number(b.w);
      const h = Number(b.h);
      if (![x, y, w, h].every((n) => Number.isFinite(n))) return null;
      return {
        x: Math.min(1, Math.max(0, x)),
        y: Math.min(1, Math.max(0, y)),
        w: Math.min(1, Math.max(0, w)),
        h: Math.min(1, Math.max(0, h)),
      };
    })
    .filter((box): box is PlateBox => box !== null);
}

function extractJson(text: string) {
  const trimmed = text.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON");
  return JSON.parse(trimmed.slice(start, end + 1)) as Record<string, unknown>;
}

export const identifyVehicle = createServerFn({ method: "POST" })
  .validator((input: { image: string }) => input)
  .handler(async ({ data }): Promise<ApiOk | ApiErr> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false, error: "Identify is unavailable right now." };
    if (!data.image || data.image.length > 1_800_000) {
      return { ok: false, error: "Photo is too large." };
    }

    const prompt = `Identify the road vehicle in this photo for a collection game.
Return JSON only with this shape:
{"isVehicle":true,"make":"Ford","model":"Fiesta","colour":"Blue","year":2019,"confidence":0.86,"plateBoxes":[{"x":0.4,"y":0.7,"w":0.2,"h":0.06}]}
Rules:
- If there is no road vehicle, set isVehicle to false and the rest to null/empty.
- make is the manufacturer (Ford, BMW, Volkswagen, Mini, Mercedes-Benz, Land Rover, etc).
- model is the range name only (Fiesta, Golf, 3 Series), not the trim.
- colour is one of: Black, White, Silver, Grey, Blue, Red, Green, Yellow, Orange, Brown, Beige, Purple.
- year is the approximate model year, or null.
- confidence is 0 to 1 for make+model together.
- plateBoxes are normalized 0-1 rectangles for any visible number plates so they can be blurred.
- NEVER transcribe a number plate. Never put plate characters in any field.
- Do not identify any person or owner.`;

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        signal: AbortSignal.timeout(28_000),
        body: JSON.stringify({

          model: "grok-4-1-fast-non-reasoning",

          temperature: 0.1,
          max_tokens: 280,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "user",
              content: [
                { type: "image_url", image_url: { url: data.image, detail: "high" } },
                { type: "text", text: prompt },
              ],
            },
          ],
        }),
      });
      if (!res.ok) return { ok: false, error: "Could not identify this photo." };
      const body = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = body.choices?.[0]?.message?.content ?? "";
      const parsed = extractJson(text);
      const makeRaw = typeof parsed.make === "string" ? parsed.make : null;
      const yearNum = typeof parsed.year === "number" ? parsed.year : Number(parsed.year);
      const result = emptyResult({
        isVehicle: Boolean(parsed.isVehicle),
        make: makeRaw ? nearestMake(makeRaw) : null,
        model: typeof parsed.model === "string" ? parsed.model : null,
        colour: typeof parsed.colour === "string" ? parsed.colour : null,
        year: Number.isFinite(yearNum) ? Math.round(yearNum) : null,
        confidence: Math.min(1, Math.max(0, Number(parsed.confidence) || 0)),
        plateBoxes: parseBoxes(parsed.plateBoxes),
      });
      return { ok: true, result };
    } catch {
      return { ok: false, error: "Could not identify this photo." };
    }
  });
