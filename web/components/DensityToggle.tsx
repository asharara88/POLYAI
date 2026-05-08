"use client";

import { useEffect, useState } from "react";
import { Layers3 } from "lucide-react";

type Density = "compact" | "cozy" | "comfortable";
const STORAGE_KEY = "polyai-density";

const DENSITY_LABEL: Record<Density, string> = {
  compact: "Compact",
  cozy: "Cozy",
  comfortable: "Comfortable",
};

const DENSITY_ORDER: Density[] = ["compact", "cozy", "comfortable"];

function applyDensity(d: Density) {
  const root = document.documentElement;
  root.dataset.density = d;
}

export default function DensityToggle() {
  const [density, setDensity] = useState<Density>("comfortable");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Density | null) ?? "comfortable";
    setDensity(saved);
    applyDensity(saved);
    setMounted(true);
  }, []);

  const cycle = () => {
    const idx = DENSITY_ORDER.indexOf(density);
    const next = DENSITY_ORDER[(idx + 1) % DENSITY_ORDER.length];
    setDensity(next);
    applyDensity(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={cycle}
      title={`Density: ${DENSITY_LABEL[density]} (click to cycle)`}
      aria-label={`Display density: ${DENSITY_LABEL[density]}. Click to cycle.`}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-label-xs font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
    >
      <Layers3 className="w-3.5 h-3.5" aria-hidden />
      <span className="hidden sm:inline">{DENSITY_LABEL[density]}</span>
    </button>
  );
}
