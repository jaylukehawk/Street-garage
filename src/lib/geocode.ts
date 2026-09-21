import { createServerFn } from "@tanstack/react-start";

export const reverseGeocode = createServerFn({ method: "POST" })
  .validator((input: { lat: number; lng: number }) => input)
  .handler(async ({ data }): Promise<{ name: string }> => {
    try {
      const url = new URL("https://nominatim.openstreetmap.org/reverse");
      url.searchParams.set("lat", String(data.lat));
      url.searchParams.set("lon", String(data.lng));
      url.searchParams.set("format", "jsonv2");
      url.searchParams.set("zoom", "17");
      const res = await fetch(url, {
        headers: { "User-Agent": "StreetGarage/1.0 (collection game)" },
      });
      if (!res.ok) return { name: "Near you" };
      const body = (await res.json()) as {
        address?: {
          road?: string;
          pedestrian?: string;
          suburb?: string;
          neighbourhood?: string;
          city?: string;
          town?: string;
          village?: string;
        };
      };
      const a = body.address ?? {};
      const street = a.road || a.pedestrian || a.neighbourhood || a.suburb;
      const place = a.city || a.town || a.village;
      if (street && place) return { name: street };
      if (street) return { name: street };
      if (place) return { name: place };
      return { name: "Near you" };
    } catch {
      return { name: "Near you" };
    }
  });
