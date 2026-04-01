type TrustScores = {
  freshness: number;
  completeness: number;
};

function scoreFromSeed(seed: string, min: number, spread: number) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return min + (hash % spread);
}

export function getTrustScores(seed: string): TrustScores {
  return {
    freshness: scoreFromSeed(`${seed}:fresh`, 91, 9),
    completeness: scoreFromSeed(`${seed}:complete`, 90, 10),
  };
}
