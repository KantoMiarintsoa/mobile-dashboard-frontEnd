"use client";

import { useCallback, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService, ApiNotification } from "@/service/notification.service";

export interface Notification {
  id: string;
  message: string;
  type: "created" | "updated" | "deleted";
  timestamp: Date;
  read: boolean;
}

function mapApiNotification(n: ApiNotification): Notification {
  const typeMap: Record<string, Notification["type"]> = {
    "user:created": "created",
    "user:updated": "updated",
    "user:deleted": "deleted",
  };
  return {
    id: n.id,
    message: n.message,
    type: typeMap[n.type] || "created",
    timestamp: new Date(n.createdAt),
    read: n.read,
  };
}

export function useNotifications() {
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);
  const queryClient = useQueryClient();

  // Load from API via React Query
  const { data: apiNotifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const data = await notificationService.getAll();
      return data.map(mapApiNotification);
    },
    refetchInterval: 30000,
  });

  // Merge: local (realtime) notifications on top, then API ones (avoid duplicates)
  const notifications = [
    ...localNotifications,
    ...apiNotifications.filter(
      (api) => !localNotifications.some((local) => local.id === api.id)
    ),
  ];

  const add = useCallback((message: string, type: Notification["type"]) => {
    setLocalNotifications((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        message,
        type,
        timestamp: new Date(),
        read: false,
      },
      ...prev,
    ]);
  }, []);

  const markAllRead = useCallback(() => {
    setLocalNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    queryClient.setQueryData(["notifications"], (old: Notification[] | undefined) =>
      old?.map((n) => ({ ...n, read: true })) ?? []
    );
    notificationService.markAllRead().catch(() => {});
  }, [queryClient]);

  const clear = useCallback(() => {
    setLocalNotifications([]);
    queryClient.setQueryData(["notifications"], []);
  }, [queryClient]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, add, markAllRead, clear };
}
