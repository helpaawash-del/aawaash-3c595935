import { describe, expect, it } from "vitest";
import { validateTowerLayout, type TowerLayout } from "../../src/lib/tower-layout";
const base: TowerLayout = { summary: "", firstFloor: 1, lastFloor: 3, expectedTotalUnits: null, floors: [{ number: 1, expectedUnits: null }, { number: 3, expectedUnits: null }], units: [], issues: [] };
describe("tower layout checks", () => {
  it("reports the missing floor 2", () => expect(validateTowerLayout(base)).toContainEqual({ kind: "missing_floor", detail: "Floor 2 is missing." }));
  it("reports duplicate flat numbers across floors", () => expect(validateTowerLayout({ ...base, units: [{ floor: 1, number: "101", configuration: null }, { floor: 3, number: "101", configuration: null }] }).some((i) => i.kind === "duplicate_flat")).toBe(true));
  it("reports expected floor count 2 versus actual 1", () => expect(validateTowerLayout({ ...base, floors: [{ number: 1, expectedUnits: 2 }], units: [{ floor: 1, number: "101", configuration: null }] })).toContainEqual({ kind: "unit_count", detail: "Floor 1: expected 2 flats, found 1." }));
  it("reports expected tower count 4 versus actual 0", () => expect(validateTowerLayout({ ...base, expectedTotalUnits: 4 })).toContainEqual({ kind: "unit_count", detail: "Tower: expected 4 flats, found 0." }));
  it("accepts a consistent layout", () => expect(validateTowerLayout({ ...base, firstFloor: 1, lastFloor: 1, expectedTotalUnits: 1, floors: [{ number: 1, expectedUnits: 1 }], units: [{ floor: 1, number: "101", configuration: null }] })).toEqual([]));
});