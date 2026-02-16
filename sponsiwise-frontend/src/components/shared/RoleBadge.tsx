const roleConfig: Record<string, { label: string; classes: string }> = {
  ADMIN: { label: "Admin", classes: "bg-red-500/10 text-red-400" },
  MANAGER: { label: "Manager", classes: "bg-amber-500/10 text-amber-400" },
  ORGANIZER: { label: "Organizer", classes: "bg-purple-500/10 text-purple-400" },
  SPONSOR: { label: "Sponsor", classes: "bg-blue-500/10 text-blue-400" },
  PUBLIC: { label: "Public", classes: "bg-slate-500/10 text-slate-400" },
};

const fallback = { label: "Unknown", classes: "bg-slate-500/10 text-slate-400" };

export default function RoleBadge({ role }: { role: string }) {
  const cfg = roleConfig[role] ?? fallback;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.classes}`}
    >
      {cfg.label}
    </span>
  );
}
