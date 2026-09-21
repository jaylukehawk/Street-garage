const EARTH_M = 6371000;

export function haversineMetres(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function isDuplicateSighting(
  candidate: { make: string; model: string; lat: number | null; lng: number | null; seenAt: string },
  existing: { make: string; model: string; lat: number | null; lng: number | null; seenAt: string },
  now = Date.now(),
  windowMs = 2 * 60 * 60 * 1000,
) {
  if (candidate.make.toLowerCase() !== existing.make.toLowerCase()) return false;
  if (candidate.model.toLowerCase() !== existing.model.toLowerCase()) return false;
  if (candidate.lat == null || candidate.lng == null) return false;
  if (existing.lat == null || existing.lng == null) return false;
  const age = now - new Date(existing.seenAt).getTime();
  if (age > windowMs || age < 0) return false;
  return (
    haversineMetres(
      { lat: candidate.lat, lng: candidate.lng },
      { lat: existing.lat, lng: existing.lng },
    ) <= 50
  );
}

export async function requestPosition(): Promise<{
  lat: number;
  lng: number;
} | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) return null;
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30_000 },
    );
  });
}

export function osmTile(lat: number, lng: number, zoom = 16) {
  const n = 2 ** zoom;
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);
  return { zoom, x, y, src: `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png` };
}
