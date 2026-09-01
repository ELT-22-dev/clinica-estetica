export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-white p-5 shadow-sm">
      <span className="text-sm font-semibold text-muted">{label}</span>
      <span className="font-serif text-3xl">{value}</span>
      {hint && <span className="text-sm text-muted">{hint}</span>}
    </div>
  );
}
