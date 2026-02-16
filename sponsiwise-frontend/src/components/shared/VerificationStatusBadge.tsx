import type { VerificationStatus } from "@/lib/types/manager";

const statusConfig: Record<
  VerificationStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800",
  },
  verified: {
    label: "Verified",
    className: "bg-green-100 text-green-700",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-700",
  },
};

interface VerificationStatusBadgeProps {
  status: VerificationStatus;
}

/**
 * Colour-coded pill for displaying verification status.
 * Server Component safe — no interactivity needed.
 */
export default function VerificationStatusBadge({
  status,
}: VerificationStatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
