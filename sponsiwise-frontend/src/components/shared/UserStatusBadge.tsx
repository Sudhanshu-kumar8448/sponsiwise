const statusConfig: Record<string, { label: string; dot: string; classes: string }> = {
  active: {
    label: "Active",
    dot: "bg-green-500",
    classes: "bg-green-50 text-green-700",
  },
  inactive: {
    label: "Inactive",
    dot: "bg-gray-400",
    classes: "bg-gray-100 text-gray-600",
  },
};

const fallback = {
  label: "Unknown",
  dot: "bg-gray-400",
  classes: "bg-gray-100 text-gray-600",
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
