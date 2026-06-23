import { describe, expect, it } from "vitest";
import { repairMojibake, repairMojibakeDeep } from "../../src/utils/responseDecoding.js";

describe("public API response decoding", () => {
  it("repairs common UTF-8-as-Latin1 Korean mojibake", () => {
    expect(repairMojibake("ìì¸ ê³µì°")).toBe("서울 공연");
    expect(repairMojibake("서울 공연")).toBe("서울 공연");
  });

  it("repairs provider fields recursively without changing field names", () => {
    expect(repairMojibakeDeep({ TITLE: "ë§í¬ ê³µì°", CITYDATA: { AREA_NM: "ìì¸" } })).toEqual({ TITLE: "마포 공연", CITYDATA: { AREA_NM: "서울" } });
  });
});
