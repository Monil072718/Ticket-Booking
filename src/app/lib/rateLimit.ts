// lib/rateLimit.ts
// NOTE: in production use Redis/Upstash to persist counters in serverless environment.
const map = new Map<string, { count: number; last: number }>();
const WINDOW = 60 * 1000; // 1 minute
const MAX = 10;

export function checkRateLimit(key: string) {
  const now = Date.now();
  const item = map.get(key) || { count: 0, last: now };
  if (now - item.last > WINDOW) {
    map.set(key, { count: 1, last: now });
    return true;
  }
  item.count += 1;
  item.last = now;
  map.set(key, item);
  return item.count <= MAX;
}
