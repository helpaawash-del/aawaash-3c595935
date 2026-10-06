import { describe, expect, it } from "vitest";
import { getProjectFlats } from "@/lib/project-flats";

describe("project flat cards", () => {
  it("keeps three cards and exactly four amenities per card", () => {
    const flats = getProjectFlats({
      flats: [{ title: "Studio", area: "600 SQft.", image: "https://example.com/studio.jpg", amenities: ["A", "B"] }],
    });

    expect(flats).toHaveLength(3);
    expect(flats[0]).toMatchObject({ title: "Studio", area: "600 SQft.", image: "https://example.com/studio.jpg" });
    expect(flats[0]?.amenities).toEqual(["A", "B", "Open living room", "Modern kitchen"]);
    expect(flats.every((flat) => flat.amenities.length === 4)).toBe(true);
  });
});