import { apiFetch } from "./client";

export interface InAppNotification {
  id: string;
  title: string;
  body: string;
  actionUrl: string | null;
  eventType: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationListResponse {
  items: InAppNotification[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function fetchNotifications(
  tenantSlug: string,
  params: { page?: number; limit?: number; isRead?: boolean } = {},
): Promise<NotificationListResponse> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.isRead !== undefined) qs.set("isRead", String(params.isRead));

  const query = qs.toString() ? `?${qs}` : "";
  return apiFetch<NotificationListResponse>(`/api/notifications${query}`, {
    tenantSlug,
  });
}

export async function fetchUnreadCount(tenantSlug: string): Promise<number> {
  const data = await apiFetch<{ count: number }>("/api/notifications/unread-count", {
    tenantSlug,
  });
  return data.count;
}

export async function markNotificationRead(
  tenantSlug: string,
  id: string,
): Promise<void> {
  await apiFetch(`/api/notifications/${id}/read`, {
    method: "PATCH",
    tenantSlug,
  });
}

export async function markAllNotificationsRead(tenantSlug: string): Promise<void> {
  await apiFetch("/api/notifications/read-all", {
    method: "PATCH",
    tenantSlug,
  });
}
