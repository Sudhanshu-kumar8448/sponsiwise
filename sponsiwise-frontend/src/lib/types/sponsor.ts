/**
 * Types for sponsor-facing dashboard data.
 *
 * These represent shapes returned by AUTHENTICATED backend endpoints
 * scoped to the sponsor's tenant/company.
 */

// ─── Proposal statuses ─────────────────────────────────────────────────

export const ProposalStatus = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  APPROVED: "approved",
  REJECTED: "rejected",
  WITHDRAWN: "withdrawn",
} as const;

export type ProposalStatus =
  (typeof ProposalStatus)[keyof typeof ProposalStatus];

// ─── Proposals ─────────────────────────────────────────────────────────

export interface Proposal {
  id: string;
  event_id: string;
  sponsorship_id: string | null;
  title: string;
  description: string;
  amount: number;
  currency: string;
  status: ProposalStatus;
  event: {
    id: string;
    title: string;
    slug: string;
    start_date: string;
    location: string;
  };
  submitted_at: string | null;
  reviewed_at: string | null;
  reviewer_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProposalsResponse {
  data: Proposal[];
  total: number;
  page: number;
  page_size: number;
}

export interface CreateProposalPayload {
  event_id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
}

// ─── Sponsorships ──────────────────────────────────────────────────────

export interface Sponsorship {
  id: string;
  event_id: string;
  company_id: string;
  tier: string;
  amount: number;
  currency: string;
  status: string;
  event: {
    id: string;
    title: string;
    slug: string;
    start_date: string;
    location: string;
  };
  created_at: string;
}

export interface SponsorshipsResponse {
  data: Sponsorship[];
  total: number;
  page: number;
  page_size: number;
}

// ─── Sponsor dashboard stats ───────────────────────────────────────────

export interface SponsorDashboardStats {
  total_proposals: number;
  pending_proposals: number;
  approved_proposals: number;
  total_sponsorships: number;
  total_invested: number;
  currency: string;
}

// ─── Browsable events (authenticated but read-only) ────────────────────

export interface BrowsableEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  expected_footfall: number;
  image_url: string | null;
  category: string;
  status: string;
  organizer: {
    id: string;
    name: string;
    logo_url: string | null;
  };
  sponsorship_tiers: SponsorshipTier[];
  tags: string[];
}

export interface SponsorshipTier {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  benefits: string[];
  slots_available: number;
}

export interface BrowsableEventsResponse {
  data: BrowsableEvent[];
  total: number;
  page: number;
  page_size: number;
}
