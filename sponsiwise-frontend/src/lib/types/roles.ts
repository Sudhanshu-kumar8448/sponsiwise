/**
 * All known user roles in the Sponsiwise platform.
 * These values must match what the backend returns on GET /auth/me.
 */
export const UserRole = {
  PUBLIC: "PUBLIC",
  SPONSOR: "SPONSOR",
  ORGANIZER: "ORGANIZER",
  MANAGER: "MANAGER",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

/**
 * Shape of the user object returned by GET /auth/me.
 */
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  tenant_id: string | null;
}
