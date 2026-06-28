"use client";

import { DemolitionStatus } from "@/types";
import { useT } from "@/lib/locale-store";
import { DEMOLITION_COLORS, DEMOLITION_ORDER } from "@/lib/utils";

export function DemolitionLegend({
  active,
  compact = false,
}: {
  active?: DemolitionStatus;
  compact?: boolean;
}) {
  const { t } = useT();

  const labelFor = (s: DemolitionStatus) =>
    s === "safe" ? t.listing.demolitionSafe : s === "soon" ? t.listing.demolitionSoon : t.listing.demolitionUnknown;

  return (
    <div className={compact ? "flex flex-wrap items-center gap-3" : "flex flex-col gap-2"}>
      {!compact && (
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft/70">
          {t.listing.colorLegendTitle}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {DEMOLITION_ORDER.map((s) => {
          const isActive = active === s;
          return (
            <span
              key={s}
              className={`flex items-center gap-1.5 text-xs rounded-full px-2 py-1 transition-all ${
                isActive ? "font-semibold" : "text-ink-soft/70"
              }`}
              style={isActive ? { backgroundColor: `${DEMOLITION_COLORS[s]}1A`, color: DEMOLITION_COLORS[s] } : undefined}
            >
              <span
                className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: DEMOLITION_COLORS[s] }}
              />
              {labelFor(s)}
            </span>
          );
        })}
      </div>
    </div>
  );
}
