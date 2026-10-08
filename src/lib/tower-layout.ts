import { z } from "zod";

// Keep the model schema unconstrained; validate domain limits after generation.
export const towerLayoutSchema = z.object({
  summary: z.string(),
  firstFloor: z.number().nullable(),
  lastFloor: z.number().nullable(),
  expectedTotalUnits: z.number().nullable(),
  floors: z.array(z.object({ number: z.number(), expectedUnits: z.number().nullable() })),
  units: z.array(z.object({ floor: z.number(), number: z.string(), configuration: z.string().nullable() })),
  issues: z.array(z.object({ kind: z.string(), detail: z.string() })),
});
export type TowerLayout = z.infer<typeof towerLayoutSchema>;
export type LayoutIssue = { kind: string; detail: string };

export function validateTowerLayout(layout: TowerLayout): LayoutIssue[] {
  const issues: LayoutIssue[] = [];
  const floors = new Set(layout.floors.map((f) => f.number));
  const first = layout.firstFloor ?? (floors.size ? Math.min(...floors) : null);
  const last = layout.lastFloor ?? (floors.size ? Math.max(...floors) : null);
  if (first !== null && last !== null && first >= -5 && last <= 200) {
    for (let n = first; n <= last; n++) if (!floors.has(n)) issues.push({ kind: "missing_floor", detail: `Floor ${n} is missing.` });
  }
  const seen = new Set<string>();
  for (const unit of layout.units) {
    const number = unit.number.trim().toUpperCase();
    if (seen.has(number)) issues.push({ kind: "duplicate_flat", detail: `Flat ${unit.number} appears more than once in this tower.` });
    seen.add(number);
    if (!floors.has(unit.floor)) issues.push({ kind: "missing_floor", detail: `Flat ${unit.number} references missing floor ${unit.floor}.` });
  }
  for (const floor of layout.floors) {
    const count = layout.units.filter((u) => u.floor === floor.number).length;
    if (floor.expectedUnits !== null && floor.expectedUnits !== count) issues.push({ kind: "unit_count", detail: `Floor ${floor.number}: expected ${floor.expectedUnits} flats, found ${count}.` });
  }
  if (layout.expectedTotalUnits !== null && layout.expectedTotalUnits !== layout.units.length) issues.push({ kind: "unit_count", detail: `Tower: expected ${layout.expectedTotalUnits} flats, found ${layout.units.length}.` });
  return issues;
}