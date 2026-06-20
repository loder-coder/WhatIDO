import type { ActivityCategory, ActivityEnvironment } from "./eventTypes.js";

export function inferEnvironment(
  category: ActivityCategory,
  venue: string,
  text: string | null = null
): ActivityEnvironment {
  const combined = `${category} ${venue} ${text ?? ""}`;
  if (/박물관|미술관|도서관|전시|갤러리|센터|문화관|공연장|극장|실내|museum|library|gallery/i.test(combined)) {
    return "indoor";
  }
  if (/공원|한강|광장|거리|축제|마켓|야외|산책|park|market|festival/i.test(combined)) {
    return category === "festival" || category === "market" ? "mixed" : "outdoor";
  }
  return null;
}
