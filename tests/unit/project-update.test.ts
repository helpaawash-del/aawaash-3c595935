import { describe, expect, it } from "vitest";
import { pickProjectUpdateFields } from "@/lib/project-update";

describe("project tab partial updates", () => {
  it("does not include defaults for fields another tab did not submit", () => {
    const parsed = {
      id: "project-id",
      name: "Savitri Enclave",
      slug: "savitri-enclave",
      location: "Darbhanga",
      project_type: "flat_inventory",
      construction_status: "under_construction",
      visibility: "public",
      price_from: 0,
      completion_percent: 0,
      display_priority: 0,
      extra: {},
      cover_url: "https://example.com/cover.jpg",
    };

    const update = pickProjectUpdateFields(parsed, {
      id: "project-id",
      name: "Savitri Enclave",
      slug: "savitri-enclave",
      location: "Darbhanga",
      project_type: "flat_inventory",
      construction_status: "under_construction",
      cover_url: "https://example.com/cover.jpg",
    });

    expect(update.cover_url).toBe("https://example.com/cover.jpg");
    expect(update).not.toHaveProperty("visibility");
    expect(update).not.toHaveProperty("price_from");
    expect(update).not.toHaveProperty("completion_percent");
    expect(update).not.toHaveProperty("display_priority");
    expect(update).not.toHaveProperty("extra");
  });
});