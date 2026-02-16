const roleConfig: Record<string, { label: string; classes: string }> = {
  ADMIN: { label: "Admin", classes: "bg-red-100 text-red-800" },
  MANAGER: { label: "Manager", classes: "bg-amber-100 text-amber-800" },
  ORGANIZER: { label: "Organizer", classes: "bg-purple-100 text-purple-800" },
  SPONSOR: { label: "Sponsor", classes: "bg-blue-100 text-blue-800" },
  PUBLIC: { label: "Public", classes: "bg-gray-100 text-gray-800" },
};

const fallback = { label: "Unknown", classes: "bg-gray-100 text-gray-600" };

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
