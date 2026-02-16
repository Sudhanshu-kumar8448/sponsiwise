// ─── Company lifecycle timeline types ────────────────────────────────

export type CompanyTimelineType =
  | "COMPANY_CREATED"
  | "COMPANY_VERIFIED"
  | "COMPANY_REJECTED"
  | "SPONSORSHIP_CREATED"
  | "PROPOSAL_SUBMITTED"
  | "PROPOSAL_APPROVED"
  | "PROPOSAL_REJECTED"
  | "PROPOSAL_STATUS_CHANGED"
  | "EMAIL_SENT"
  | "EMAIL_FAILED"
  | "NOTIFICATION_CREATED"
  | "AUDIT_LOG";

export interface CompanyTimelineEntry {
  type: CompanyTimelineType;
  entityType: string;
  entityId: string;
  actorId?: string;
  actorRole?: string;
  status?: string;
  recipient?: string;
  subject?: string;
  description?: string;
  timestamp: Date | string;
}
/**
 * Types for manager-facing dashboard data.
 *
 * Managers are platform moderators with READ-HEAVY access
 * and LIMITED write access (verify / reject only).
 */

// ─── Verification statuses ─────────────────────────────────────────────

export const VerificationStatus = {
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
} as const;

export type VerificationStatus =
  (typeof VerificationStatus)[keyof typeof VerificationStatus];

// ─── Companies awaiting verification ───────────────────────────────────

export interface VerifiableCompany {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string | null;
  website: string | null;
  logo_url: string | null;
  industry: string | null;
  description: string | null;
  verification_status: VerificationStatus;
  verification_notes: string | null;
  verified_at: string | null;
  owner: {
    id: string;
    email: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface VerifiableCompaniesResponse {
  data: VerifiableCompany[];
  total: number;
  page: number;
  page_size: number;
}

// ─── Events awaiting verification ──────────────────────────────────────

export interface VerifiableEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  image_url: string | null;
  category: string;
  /** draft | pending_review | published | cancelled | completed */
  status: string;
  verification_status: VerificationStatus;
  verification_notes: string | null;
  verified_at: string | null;
  organizer: {
    id: string;
    name: string;
    email: string;
    logo_url: string | null;
  };
  tags: string[];
  expected_footfall?: number;
  created_at: string;
  updated_at: string;
}

export interface VerifiableEventsResponse {
  data: VerifiableEvent[];
  total: number;
  page: number;
  page_size: number;
}

// ─── Verification action payload ───────────────────────────────────────

export interface VerificationPayload {
  action: "verify" | "reject";
  notes?: string;
}

// ─── System activity log ───────────────────────────────────────────────

export interface ActivityEntry {
  id: string;
  type: string;
  /** e.g. "user_registered" | "proposal_submitted" | "event_published" | "company_verified" */
  action: string;
  description: string;
  actor: {
    id: string;
    email: string;
    name: string;
    role: string;
  } | null;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface ActivityLogResponse {
  data: ActivityEntry[];
  total: number;
  page: number;
  page_size: number;
}

// ─── Manager dashboard stats ───────────────────────────────────────────

export interface ManagerDashboardStats {
  companies_pending: number;
  companies_verified: number;
  events_pending: number;
  events_verified: number;
  total_users: number;
  recent_registrations: number;
}

// ─── Event lifecycle types ─────────────────────────────────────────────

export type TimelineType =
  | "EVENT_CREATED"
  | "EVENT_VERIFIED"
  | "EVENT_REJECTED"
  | "PROPOSAL_SUBMITTED"
  | "PROPOSAL_APPROVED"
  | "PROPOSAL_REJECTED"
  | "PROPOSAL_STATUS_CHANGED"
  | "EMAIL_SENT"
  | "EMAIL_FAILED"
  | "AUDIT_LOG";

export interface TimelineEntry {
  type: TimelineType;
  entityType: string;
  entityId: string;
  actorId?: string;
  actorRole?: string;
  status?: string;
  recipient?: string;
  subject?: string;
  description?: string;
  timestamp: string;
}

export interface LifecycleProgress {
  totalSteps: number;
  completedSteps: number;
  percentage: number;
}

export interface LifecycleProposal {
  id: string;
  status: string;
  proposedTier: string | null;
  proposedAmount: number | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  createdAt: string;
  sponsorship: {
    id: string;
    company: {
      id: string;
      name: string;
    };
  };
}

export interface LifecycleEvent {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startDate: string;
  endDate: string;
  status: string;
  verificationStatus: string;
  createdAt: string;
  organizer: {
    id: string;
    name: string;
    contactEmail: string | null;
    logoUrl: string | null;
  };
}

export interface EventLifecycleResponse {
  event: LifecycleEvent;
  proposals: LifecycleProposal[];
  progress: LifecycleProgress;
  timeline: TimelineEntry[];
}

// ─── Company lifecycle view types ──────────────────────────────────────

export interface CompanyLifecycleStats {
  totalProposals: number;
  approvedProposals: number;
  rejectedProposals: number;
  totalSponsorships: number;
  totalEmails: number;
  failedEmails: number;
}

export interface CompanyLifecycleCompany {
  id: string;
  name: string;
  slug: string | null;
  type: string;
  description: string | null;
  website: string | null;
  logoUrl: string | null;
  verificationStatus: string;
  createdAt: string;
  updatedAt: string;
  owner: { id: string; email: string };
}

export interface CompanyLifecycleResponse {
  company: CompanyLifecycleCompany;
  stats: CompanyLifecycleStats;
  progress: LifecycleProgress;
  timeline: CompanyTimelineEntry[];
}
