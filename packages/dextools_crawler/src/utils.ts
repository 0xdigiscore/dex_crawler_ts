export function safeCompare(a: number, b: number): number {
  if (!isFinite(a) && !isFinite(b)) return 0;
  if (!isFinite(a)) return 1;
  if (!isFinite(b)) return -1;
  if (a === b) return 0;
  return a > b ? 1 : -1;
}
