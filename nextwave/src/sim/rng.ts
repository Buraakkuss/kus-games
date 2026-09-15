/* Tohumlanmis rastgelelik — diger uc oyunla ayni mulberry32.
   Her kosunun tohumu saklanir: hata ayiklanabilir ve tekrarlanabilir olur. */
export type Rng = () => number;

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(rng: Rng, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

export function range(rng: Rng, lo: number, hi: number): number {
  return lo + rng() * (hi - lo);
}
