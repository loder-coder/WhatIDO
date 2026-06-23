/** Safely parse public API JSON as UTF-8 and repair common UTF-8-as-Latin1 mojibake. */
export async function readUtf8Json<T>(body: { arrayBuffer(): Promise<ArrayBuffer> }): Promise<T> {
  const bytes = await body.arrayBuffer();
  const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  return repairMojibakeDeep(JSON.parse(text) as unknown) as T;
}

export function repairMojibake(value: string): string {
  if (!/[\u00c2\u00c3\u00e2\u00eb\u00ec\u00ed\u00ea\u00e3]/.test(value)) return value;
  try {
    const repaired = Buffer.from(value, "latin1").toString("utf8");
    return repaired.includes("�") ? value : repaired;
  } catch { return value; }
}

export function repairMojibakeDeep(value: unknown): unknown {
  if (typeof value === "string") return repairMojibake(value);
  if (Array.isArray(value)) return value.map(repairMojibakeDeep);
  if (typeof value !== "object" || value === null) return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, repairMojibakeDeep(item)]));
}
