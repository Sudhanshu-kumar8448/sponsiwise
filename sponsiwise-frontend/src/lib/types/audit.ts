/**
 * Audit log entry returned by GET /audit-logs.
 *
 * Mirrors the Prisma AuditLog model on the backend.
 * Generic across all roles — role-aware filtering happens server-side.
 */
export interface AuditLogEntry {
  id: string;
  tenantId: string;
  actorId: string;
  actorRole: string;
  /** Machine action key (e.g. "proposal.created", "company.verified") */
  action: string;
  entityType: string;
  entityId: string;
  /** Arbitrary structured metadata */
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface AuditLogsResponse {
  data: AuditLogEntry[];
  total: number;
  page: number;
  pageSize: number;
}
