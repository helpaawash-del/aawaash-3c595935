import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ScanSearch, LoaderCircle, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminReviewTower } from "@/lib/tower-review.functions";
import type { TowerLayout } from "@/lib/tower-layout";

export function TowerLayoutReview({ buildingId }: { buildingId: string }) {
  const review = useServerFn(adminReviewTower);
  const [description, setDescription] = useState("");
  const [layout, setLayout] = useState<TowerLayout | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit() {
    setBusy(true); setError(null); setLayout(null);
    try {
      const response = await review({ data: { building_id: buildingId, description } });
      if (response.ok) setLayout(response.layout); else setError(response.message);
    } catch (e) { setError(e instanceof Error ? e.message : "Review failed. No inventory was changed."); }
    finally { setBusy(false); }
  }
  return <section className="border-b border-border pb-5 mb-5 space-y-3">
    <h4 className="font-semibold text-foreground">Tower layout review</h4>
    <label className="block text-sm text-muted-foreground" htmlFor={`tower-layout-${buildingId}`}>Floor and flat layout</label>
    <textarea id={`tower-layout-${buildingId}`} value={description} disabled={busy} maxLength={18000} onChange={(e) => { setDescription(e.target.value); setLayout(null); }} className="w-full min-h-32 rounded-md border border-input bg-background p-3 text-sm text-foreground" placeholder="Tower A: floors 1–3, 2 flats per floor. Floor 1: 101, 102. Floor 3: 301, 301. Total: 6 flats." />
    <div className="flex flex-wrap gap-2">
      <Button disabled={busy || description.trim().length < 10} onClick={submit}>{busy ? <LoaderCircle className="animate-spin" /> : <ScanSearch />} {busy ? "Reviewing…" : "Review layout"}</Button>
      <label className="inline-flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"><FileUp size={16} /> Upload text layout<input type="file" accept=".txt,.csv,.json,text/plain,text/csv,application/json" className="sr-only" disabled={busy} onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; if (file.size > 72000) { setError("Choose a text file smaller than 72 KB."); return; } setDescription((await file.text()).slice(0,18000)); setLayout(null); setError(null); }} /></label>
    </div>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {layout && <div className="space-y-3" aria-live="polite">
      <p className="text-sm text-foreground">{layout.summary}</p>
      <p className="text-xs text-muted-foreground">{layout.floors.length} floors · {layout.units.length} flats · {layout.issues.length} findings · Inventory unchanged</p>
      {layout.issues.length > 0 ? <ul className="space-y-1 text-sm text-destructive">{layout.issues.map((issue, i) => <li key={i}>{issue.detail}</li>)}</ul> : <p className="text-sm text-success">No missing floors, duplicate flat numbers, or inconsistent counts found.</p>}
      <div className="max-h-72 overflow-auto border-y border-border"><table className="w-full text-sm text-left"><thead><tr><th className="py-2">Floor</th><th>Expected</th><th>Flats</th></tr></thead><tbody>{layout.floors.map((floor,i) => <tr key={i} className="border-t border-border"><td className="py-2">{floor.number}</td><td>{floor.expectedUnits ?? "—"}</td><td className="break-words">{layout.units.filter((u) => u.floor === floor.number).map((u) => u.number).join(", ") || "—"}</td></tr>)}</tbody></table></div>
    </div>}
  </section>;
}