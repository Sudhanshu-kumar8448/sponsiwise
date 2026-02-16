/**
 * Types for admin-facing dashboard data.
 *
 * ADMIN is a tenant-level system administrator who can:
 * - Manage users within their tenant
 * - Assign/revoke roles (except SUPER_ADMIN)
 * - Activate/deactivate users
 * - View system-wide tenant metrics
 */

// ─── Assignable roles ──────────────────────────────────────────────────

/**
 * Roles an ADMIN is allowed to assign.
 * SUPER_ADMIN is intentionally excluded — only the platform itself manages
 * that role.
 */
export const AssignableRole = {
  SPONSOR: "SPONSOR",
  ORGANIZER: "ORGANIZER",
  MANAGER: "MANAGER",
  ADMIN: "ADMIN",
} as const;

export type AssignableRole =
  (typeof AssignableRole)[keyof typeof AssignableRole];

/** All assignable role values as an array for iteration in UIs. */
export const ASSIGNABLE_ROLES = Object.values(AssignableRole);

// ─── User status ───────────────────────────────────────────────────────

export const UserStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

// ─── Tenant user ───────────────────────────────────────────────────────

export interface TenantUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: UserStatus;
  avatar_url: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TenantUsersResponse {
  data: TenantUser[];
  total: number;
  page: number;
  page_size: number;
}

// ─── User detail ───────────────────────────────────────────────────────

export interface TenantUserDetail extends TenantUser {
  /** Additional profile fields the detail endpoint may return */
  phone: string | null;
  company_name: string | null;
  company_id: string | null;
}

// ─── Role update payload ───────────────────────────────────────────────

export interface RoleUpdatePayload {
  role: AssignableRole;
}

// ─── Status update payload ─────────────────────────────────────────────

export interface StatusUpdatePayload {
  status: "active" | "inactive";
}

// ─── System overview stats ─────────────────────────────────────────────

export interface AdminDashboardStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  users_by_role: Record<string, number>;
  total_companies: number;
  total_events: number;
  total_proposals: number;
  total_sponsorships: number;
  recent_registrations: number;
  /** e.g. last-30-day daily signups */
  signup_trend: { date: string; count: number }[];
}
