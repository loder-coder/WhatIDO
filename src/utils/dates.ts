const SEOUL_TIME_ZONE = "Asia/Seoul";

export type Intent = "today" | "tomorrow" | "weekend";

export interface DateWindow {
  readonly start: Date;
  readonly end: Date;
}

function getSeoulParts(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: SEOUL_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    weekday: "short"
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
    weekday: parts.weekday ?? "Sun"
  };
}

export function formatSeoulIso(date: Date): string {
  const parts = getSeoulParts(date);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}:${pad(parts.second)}+09:00`;
}

export function toSeoulDateString(date: Date): string {
  return formatSeoulIso(date).slice(0, 10);
}

export function parseDateOnly(date: string): Date {
  return new Date(`${date}T00:00:00+09:00`);
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function getIntentDateWindow(intent: Intent, now = new Date()): DateWindow {
  const today = parseDateOnly(toSeoulDateString(now));
  if (intent === "today") {
    const end = new Date(`${toSeoulDateString(now)}T23:59:59+09:00`);
    return { start: now, end };
  }
  if (intent === "tomorrow") {
    const target = addDays(today, 1);
    const dateText = toSeoulDateString(target);
    return {
      start: new Date(`${dateText}T00:00:00+09:00`),
      end: new Date(`${dateText}T23:59:59+09:00`)
    };
  }
  const weekdayIndex: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6
  };
  const weekday = weekdayIndex[getSeoulParts(now).weekday] ?? 0;
  const daysUntilSaturday = weekday === 6 ? 0 : (6 - weekday + 7) % 7;
  const saturday = addDays(today, daysUntilSaturday);
  const sunday = addDays(saturday, 1);
  return {
    start: weekday === 6 ? now : new Date(`${toSeoulDateString(saturday)}T00:00:00+09:00`),
    end: new Date(`${toSeoulDateString(sunday)}T23:59:59+09:00`)
  };
}
