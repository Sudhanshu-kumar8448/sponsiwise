import type { ProposalStatus } from "@/lib/types/sponsor";

const statusConfig: Record<
  ProposalStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className: "bg-slate-500/10 text-slate-400",
  },
  submitted: {
    label: "Submitted",
    className: "bg-blue-500/10 text-blue-400",
  },
  under_review: {
    label: "Under Review",
    className: "bg-amber-500/10 text-amber-400",
  },
  approved: {
    label: "Approved",
    className: "bg-emerald-500/10 text-emerald-400",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-500/10 text-red-400",
  },
  withdrawn: {
    label: "Withdrawn",
    className: "bg-slate-500/10 text-slate-500",
  },
};

interface ProposalStatusBadgeProps {
  status: ProposalStatus;
}

/**
 * Colour-coded pill for displaying proposal status.
 * Server Component safe — no interactivity needed.
 */
export default function ProposalStatusBadge({
  status,
}: ProposalStatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-slate-500/10 text-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
