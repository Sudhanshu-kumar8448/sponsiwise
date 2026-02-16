/**
 * Types for organizer-facing dashboard data.
 *
 * These represent shapes returned by AUTHENTICATED backend endpoints
 * scoped to the organizer's tenant / events.
 */

import type { ProposalStatus } from "@/lib/types/sponsor";

// ─── Organizer events ──────────────────────────────────────────────────

export interface OrganizerEvent {
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
  /** draft | published | cancelled | completed */
  status: string;
  sponsorship_tiers: OrganizerSponsorshipTier[];
  tags: string[];
  total_proposals: number;
  pending_proposals: number;
  total_sponsorship_amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizerSponsorshipTier {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  benefits: string[];
  slots_total: number;
  slots_available: number;
}

export interface OrganizerEventsResponse {
  data: OrganizerEvent[];
  total: number;
  page: number;
  page_size: number;
}

// ─── Incoming proposals from sponsors ──────────────────────────────────

export interface IncomingProposal {
  id: string;
  event_id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  status: ProposalStatus;
  sponsor: {
    id: string;
    name: string;
    logo_url: string | null;
    email: string;
  };
  event: {
    id: string;
    title: string;
    slug: string;
  };
  submitted_at: string | null;
  reviewed_at: string | null;
  reviewer_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface IncomingProposalsResponse {
  data: IncomingProposal[];
  total: number;
  page: number;
  page_size: number;
}

// ─── Review action payload ─────────────────────────────────────────────

export interface ReviewProposalPayload {
  action: "approve" | "reject";
  reviewer_notes?: string;
}

// ─── Organizer dashboard stats ─────────────────────────────────────────

export interface OrganizerDashboardStats {
  total_events: number;
  published_events: number;
  total_proposals_received: number;
  pending_proposals: number;
  approved_proposals: number;
  total_sponsorship_revenue: number;
  currency: string;
}
