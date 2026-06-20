import { toSeoulDateString } from "../../utils/dates.js";
import type { ActivityCandidate, EventSearchRequest } from "./eventTypes.js";

function dateOverlaps(candidate: ActivityCandidate, request: EventSearchRequest): boolean {
  if (!candidate.startDate || !candidate.endDate) {
    return true;
  }
  const requestStart = toSeoulDateString(request.start);
  const requestEnd = toSeoulDateString(request.end);
  return candidate.startDate <= requestEnd && candidate.endDate >= requestStart;
}

function isTodayAvailable(candidate: ActivityCandidate, request: EventSearchRequest): boolean {
  if (request.intent !== "today") {
    return true;
  }
  if (!candidate.endTime) {
    return true;
  }
  const date = toSeoulDateString(request.now);
  const end = new Date(`${date}T${candidate.endTime}:00+09:00`);
  return end.getTime() > request.now.getTime();
}

export function filterCandidatesByDate(
  candidates: readonly ActivityCandidate[],
  request: EventSearchRequest
): ActivityCandidate[] {
  return candidates.filter((candidate) => dateOverlaps(candidate, request) && isTodayAvailable(candidate, request));
}

export function deduplicateCandidates(candidates: readonly ActivityCandidate[]): ActivityCandidate[] {
  const seen = new Set<string>();
  const unique: ActivityCandidate[] = [];
  for (const candidate of candidates) {
    const key = `${candidate.title.trim()}|${candidate.venue.trim()}|${candidate.startDate ?? ""}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(candidate);
    }
  }
  return unique;
}
