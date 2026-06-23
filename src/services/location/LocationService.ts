import { calculateHaversineKm, getDistrictCenter, type Coordinates } from "../../utils/geo.js";
import type { DistanceDestination, DistanceResult, TransportMode } from "./locationTypes.js";

export const SEOUL_DEFAULT_COORDINATES: Coordinates = {
  latitude: 37.5665,
  longitude: 126.978
};

export class LocationService {
  resolveLocation(input: {
    readonly latitude?: number | undefined;
    readonly longitude?: number | undefined;
    readonly lat?: number | undefined;
    readonly lng?: number | undefined;
    readonly district?: string | undefined;
  }): { coordinates: Coordinates; district: string | null; approximated: boolean } {
    const latitude = input.latitude ?? input.lat;
    const longitude = input.longitude ?? input.lng;
    if (latitude !== undefined && longitude !== undefined) {
      return { coordinates: { latitude, longitude }, district: input.district ?? null, approximated: false };
    }
    const center = getDistrictCenter(input.district);
    return {
      coordinates: center ?? SEOUL_DEFAULT_COORDINATES,
      district: input.district ?? "서울특별시",
      approximated: true
    };
  }

  calculateDistances(
    origin: Coordinates | null,
    destinations: readonly DistanceDestination[],
    transportMode: TransportMode
  ): Map<string, DistanceResult> {
    const results = new Map<string, DistanceResult>();
    for (const destination of destinations) {
      if (!origin || !destination.coordinates) {
        results.set(destination.id, {
          id: destination.id,
          distanceKm: null,
          estimatedMinutes: null,
          transportMode,
          confidence: "low"
        });
        continue;
      }
      const distanceKm = Number(calculateHaversineKm(origin, destination.coordinates).toFixed(1));
      const speedKmh = transportMode === "walking" ? 4 : transportMode === "driving" ? 25 : 18;
      results.set(destination.id, {
        id: destination.id,
        distanceKm,
        estimatedMinutes: Math.max(5, Math.round((distanceKm / speedKmh) * 60)),
        transportMode,
        confidence: "medium"
      });
    }
    return results;
  }
}
