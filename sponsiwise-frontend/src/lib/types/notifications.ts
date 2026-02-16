/**
 * Notification record returned by GET /notifications.
 *
 * Mirrors the shape the backend NotificationProcessor would persist
 * once the notifications table + controller are wired.
 */
export interface Notification {
  id: string;
  /** User this notification belongs to */
  userId: string;
  tenantId: string;

  /** Short title (e.g. "Proposal Approved") */
  title: string;
  /** Longer description (e.g. "Your proposal #123 has been approved.") */
  message: string;

  /** Notification severity for visual styling */
  severity: "info" | "success" | "warning" | "error";
  /** Whether the user has read this notification */
  read: boolean;

  /**
   * Optional deep-link target.
   * If present, the notification can navigate the user to the entity.
   * e.g. "/dashboard/proposals/clxyz123"
   */
  link: string | null;

  /** Related entity context (optional) */
  entityType: string | null;
  entityId: string | null;

  createdAt: string;
}

export interface NotificationsResponse {
  data: Notification[];
  total: number;
  page: number;
  pageSize: number;
}
