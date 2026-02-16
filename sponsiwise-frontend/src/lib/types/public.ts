/**
 * Public-facing data types.
 *
 * These represent the shapes returned by the backend's PUBLIC endpoints
 * (no auth required). Keep them separate from internal/dashboard types.
 */

// ─── Events ────────────────────────────────────────────────────────────

export interface PublicEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  image_url: string | null;
  category: string;
  status: "published" | "active";
  organizer: {
    id: string;
    name: string;
    logo_url: string | null;
  };
  tags: string[];
  created_at: string;
}

export interface PublicEventsResponse {
  data: PublicEvent[];
  total: number;
  page: number;
  page_size: number;
}

// ─── Companies ─────────────────────────────────────────────────────────

export interface PublicCompany {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo_url: string | null;
  website: string | null;
  industry: string;
  location: string;
  founded_year: number | null;
  social_links: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  sponsored_events: PublicCompanyEvent[];
}

export interface PublicCompanyEvent {
  id: string;
  title: string;
  slug: string;
  start_date: string;
  location: string;
  image_url: string | null;
}

// ─── Landing page highlights ───────────────────────────────────────────

export interface PlatformStats {
  total_events: number;
  total_sponsors: number;
  total_organizers: number;
}
