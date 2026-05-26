"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  type InAppNotification,
} from "@/lib/api/notifications";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

const POLL_INTERVAL_MS = 30_000; // fallback poll every 30s when socket is down

export function useNotifications(tenantSlug: string | null) {
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  // ── Load initial notifications from REST ─────────────────────────────────
  const load = useCallback(async () => {
    if (!tenantSlug) return;
    try {
      const [result, count] = await Promise.all([
        fetchNotifications(tenantSlug, { limit: 20 }),
        fetchUnreadCount(tenantSlug),
      ]);
      if (!mountedRef.current) return;
      setNotifications(result.items ?? []);
      setUnreadCount(count);
      setHasMore((result.meta?.totalPages ?? 1) > 1);
    } catch {
      // silently ignore — user may not be logged in yet
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [tenantSlug]);

  // ── Mark one as read ─────────────────────────────────────────────────────
  const markRead = useCallback(
    async (id: string) => {
      if (!tenantSlug) return;
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      await markNotificationRead(tenantSlug, id).catch(() => {});
    },
    [tenantSlug],
  );

  // ── Mark all as read ────────────────────────────────────────────────────
  const markAllRead = useCallback(async () => {
    if (!tenantSlug) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    await markAllNotificationsRead(tenantSlug).catch(() => {});
  }, [tenantSlug]);

  // ── Socket.IO setup ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!tenantSlug) return;

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    const socket = io(API_BASE, {
      path: "/socket.io",
      auth: { token },
      transports: ["websocket", "polling"],
      reconnectionDelay: 2000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect_error", (err) => {
      if (err.message === "Unauthorized") {
        socket.disconnect(); // Stop retrying if the token is invalid/expired
      }
    });

    socket.on("notification", (data: InAppNotification) => {
      if (!mountedRef.current) return;
      // Prepend new notification and bump unread count
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((c) => c + 1);
    });

    socket.on("disconnect", () => {
      // Start polling as fallback while socket is reconnecting
      if (!pollRef.current) {
        pollRef.current = setInterval(load, POLL_INTERVAL_MS);
      }
    });

    socket.on("connect", () => {
      // Stop fallback polling once socket reconnects
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [tenantSlug, load]);

  // ── Initial load ─────────────────────────────────────────────────────────
  useEffect(() => {
    mountedRef.current = true;
    load();
    return () => {
      mountedRef.current = false;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [load]);

  return { notifications, unreadCount, loading, hasMore, markRead, markAllRead, reload: load };
}
