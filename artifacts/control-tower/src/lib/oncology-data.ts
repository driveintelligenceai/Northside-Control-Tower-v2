/**
 * Deterministic simulated oncology + cardio-oncology data.
 * Uses seeded pseudorandom so numbers are stable across renders.
 */

function seedRng(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i);
    h |= 0;
  }
  return () => {
    h ^= h << 13;
    h ^= h >> 17;
    h ^= h << 5;
    return (h >>> 0) / 0xffffffff;
  };
}

function rangeInt(rng: () => number, min: number, max: number): number {
  return Math.round(min + rng() * (max - min));
}

export type PatientSubtype = {
  label: string;
  key: string;
  value: number;
  trend: number;
  target: number;
};

export function getNetNewSubtypes(): PatientSubtype[] {
  const rng = seedRng("net_new_subtypes_2026_q1");
  return [
    { label: "Enterprise New", key: "enterprise_new", value: rangeInt(rng, 180, 220), trend: +(rng() * 0.14 - 0.04).toFixed(3), target: 210 },
    { label: "Specialty New", key: "specialty_new", value: rangeInt(rng, 95, 130), trend: +(rng() * 0.18 - 0.02).toFixed(3), target: 115 },
    { label: "Reactivated >24mo", key: "reactivated", value: rangeInt(rng, 55, 80), trend: +(rng() * 0.1 - 0.03).toFixed(3), target: 70 },
    { label: "Returning", key: "returning", value: rangeInt(rng, 280, 340), trend: +(rng() * 0.06 - 0.02).toFixed(3), target: 300 },
  ];
}

export type TumorSite = {
  name: string;
  leads: number;
  consults: number;
  treatmentStarts: number;
  completed: number;
};

export function getTumorSiteFunnel(): TumorSite[] {
  const sites = ["Breast", "Lung", "Colorectal", "Prostate", "Melanoma", "Head & Neck", "Gynecologic", "Lymphoma"];
  return sites.map((name, i) => {
    const rng = seedRng(`tumor_site_${name}_funnel`);
    const leads = rangeInt(rng, 60 - i * 4, 120 - i * 5);
    const consults = Math.round(leads * (0.62 + rng() * 0.2));
    const treatmentStarts = Math.round(consults * (0.55 + rng() * 0.2));
    const completed = Math.round(treatmentStarts * (0.70 + rng() * 0.2));
    return { name, leads, consults, treatmentStarts, completed };
  });
}

export type ReferralStage = {
  stage: string;
  count: number;
  pct: number;
};

export function getReferralLifecycle(): ReferralStage[] {
  const rng = seedRng("referral_lifecycle_oncology_2026");
  const created = rangeInt(rng, 380, 420);
  const contacted = Math.round(created * (0.86 + rng() * 0.06));
  const scheduled = Math.round(contacted * (0.74 + rng() * 0.1));
  const completed = Math.round(scheduled * (0.68 + rng() * 0.12));
  const leaked = created - completed;
  return [
    { stage: "Created", count: created, pct: 100 },
    { stage: "Contacted", count: contacted, pct: +(contacted / created * 100).toFixed(1) },
    { stage: "Scheduled", count: scheduled, pct: +(scheduled / created * 100).toFixed(1) },
    { stage: "Completed", count: completed, pct: +(completed / created * 100).toFixed(1) },
    { stage: "Leaked", count: leaked, pct: +(leaked / created * 100).toFixed(1) },
  ];
}

export type TimeToConsult = {
  week: string;
  median: number;
  p90: number;
};

export function getTimeToConsultTrend(): TimeToConsult[] {
  const rng = seedRng("time_to_consult_trend_weekly");
  return Array.from({ length: 8 }, (_, i) => ({
    week: `W${i + 1}`,
    median: rangeInt(rng, 8, 16),
    p90: rangeInt(rng, 18, 30),
  }));
}

export type CardioOncStage = {
  stage: string;
  count: number;
  rate: number;
};

export function getCardioOncPipeline(): CardioOncStage[] {
  const rng = seedRng("cardio_onc_pipeline_q1_2026");
  const eligible = rangeInt(rng, 280, 320);
  const screened = Math.round(eligible * (0.61 + rng() * 0.12));
  const enrolled = Math.round(screened * (0.44 + rng() * 0.14));
  const adherent = Math.round(enrolled * (0.72 + rng() * 0.14));
  return [
    { stage: "Eligible", count: eligible, rate: 100 },
    { stage: "Screened", count: screened, rate: +(screened / eligible * 100).toFixed(1) },
    { stage: "Enrolled", count: enrolled, rate: +(enrolled / eligible * 100).toFixed(1) },
    { stage: "Adherent (30d)", count: adherent, rate: +(adherent / enrolled * 100).toFixed(1) },
  ];
}
