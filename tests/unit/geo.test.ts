import { describe, expect, it } from "vitest";
import { getDistrictCenter, normalizeSeoulDistrict } from "../../src/utils/geo.js";
import { LocationService } from "../../src/services/location/LocationService.js";

describe("Seoul location normalization", () => {
  it("normalizes suffixless districts, neighborhoods, and surrounding phrases", () => {
    expect(normalizeSeoulDistrict(" 강남 ")).toBe("강남구");
    expect(normalizeSeoulDistrict("강남역 근처")).toBe("강남구");
    expect(normalizeSeoulDistrict("을지로")).toBe("중구");
    expect(getDistrictCenter("서울시 마포구")).toBeTruthy();
  });

  it("marks only the final Seoul-center fallback as fallbackUsed", () => {
    const service = new LocationService();
    expect(service.resolveLocation({ district: "홍대" })).toMatchObject({
      district: "마포구",
      approximated: true,
      fallbackUsed: false
    });
    expect(service.resolveLocation({ district: "알 수 없는 곳" })).toMatchObject({
      approximated: true,
      fallbackUsed: true
    });
  });
});
