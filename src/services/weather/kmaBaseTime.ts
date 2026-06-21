export function formatKmaDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

export function resolveUltraSrtNcstBase(date: Date): { baseDate: string; baseTime: string } {
  const resolved = new Date(date);
  if (resolved.getMinutes() < 45) {
    resolved.setHours(resolved.getHours() - 1);
  }

  return {
    baseDate: formatKmaDate(resolved),
    baseTime: `${String(resolved.getHours()).padStart(2, "0")}00`
  };
}

export function resolveVilageFcstBase(date: Date): { baseDate: string; baseTime: string } {
  const baseHours = [2, 5, 8, 11, 14, 17, 20, 23];
  const resolved = new Date(date);
  const hour = resolved.getHours();
  const availableHour = [...baseHours].reverse().find((baseHour) => hour >= baseHour + 1);

  if (availableHour === undefined) {
    resolved.setDate(resolved.getDate() - 1);
    return {
      baseDate: formatKmaDate(resolved),
      baseTime: "2300"
    };
  }

  return {
    baseDate: formatKmaDate(resolved),
    baseTime: `${String(availableHour).padStart(2, "0")}00`
  };
}
