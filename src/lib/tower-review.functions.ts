import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { validateTowerLayout } from "./tower-layout";

export const adminReviewTower = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ building_id: z.string().uuid(), description: z.string().trim().min(10).max(18000) }).parse(input))
  .handler(async ({ data, context }) => {
    const role = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "super_admin" });
    if (role.error || !role.data) throw new Error("Admin only");
    const building = await context.supabase.from("buildings").select("id").eq("id", data.building_id).maybeSingle();
    if (building.error || !building.data) throw new Error("Tower not found");
    const state = await context.supabase.from("ai_feature_state" as never).select("message").eq("id", "tower-review").maybeSingle();
    if (state.error) throw new Error(state.error.message);
    const blocked = state.data as { message: string } | null;
    if (blocked) return { ok: false as const, status: 403, message: blocked.message };
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return { ok: false as const, status: 401, message: "AI review is not configured." };
    const { reviewTower, TowerReviewError } = await import("./ai/tower-review.server");
    try {
      const layout = await reviewTower(data.description, key);
      if (layout.floors.length > 205 || layout.units.length > 500 || layout.floors.some((f) => !Number.isInteger(f.number) || f.number < -5 || f.number > 200)) {
        return { ok: false as const, status: 422, message: "Submit a smaller layout with floor numbers between -5 and 200." };
      }
      const checks = validateTowerLayout(layout);
      const issues = [...checks, ...layout.issues].filter((item, index, all) => all.findIndex((other) => other.detail === item.detail) === index);
      return { ok: true as const, layout: { ...layout, issues } };
    } catch (error) {
      if (error instanceof TowerReviewError) {
        if (error.denial) {
          const saved = await context.supabase.from("ai_feature_state" as never).upsert({ id: "tower-review", message: error.message } as never);
          if (saved.error) throw new Error(saved.error.message);
        }
        return { ok: false as const, status: error.status, message: error.message };
      }
      return { ok: false as const, status: 500, message: error instanceof Error ? error.message : "AI review failed. No inventory was changed." };
    }
  });