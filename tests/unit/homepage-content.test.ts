import { describe, expect, it } from "vitest";
import { mergeHomepage } from "@/lib/homepage-content";

describe("homepage content merging", () => {
  it("preserves an edited hero image while filling omitted defaults", () => {
    const result = mergeHomepage({
      hero: { enabled: true, image: "https://example.com/real-building.png" },
    });

    expect(result.hero.image).toBe("https://example.com/real-building.png");
    expect(result.hero.title).toBe("Home isn't a place.");
    expect(result.projects.enabled).toBe(true);
  });
});