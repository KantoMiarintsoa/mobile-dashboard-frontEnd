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

  const { data: apiNotifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const data = await notificationService.getAll();
      return data.map(mapApiNotification);
    },
    refetchInterval: 30000,
  });

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

  const remove = useCallback((id: string) => {
    setLocalNotifications((prev) => prev.filter((n) => n.id !== id));
    queryClient.setQueryData(["notifications"], (old: Notification[] | undefined) =>
      old?.filter((n) => n.id !== id) ?? []
    );
    notificationService.remove(id).catch(() => {});
  }, [queryClient]);

  const clear = useCallback(() => {
    setLocalNotifications([]);
    queryClient.setQueryData(["notifications"], []);
    notificationService.removeAll().catch(() => {});
  }, [queryClient]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, add, markAllRead, remove, clear };
}
