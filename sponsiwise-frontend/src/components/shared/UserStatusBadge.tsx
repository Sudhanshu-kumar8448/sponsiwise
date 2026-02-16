const statusConfig: Record<string, { label: string; dot: string; classes: string }> = {
  active: {
    label: "Active",
    dot: "bg-emerald-500",
    classes: "bg-emerald-500/10 text-emerald-400",
  },
  inactive: {
    label: "Inactive",
    dot: "bg-slate-400",
    classes: "bg-slate-500/10 text-slate-400",
  },
};

const fallback = {
  label: "Unknown",
  dot: "bg-slate-400",
  classes: "bg-slate-500/10 text-slate-400",
};

export default function UserStatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? fallback;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.classes}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
