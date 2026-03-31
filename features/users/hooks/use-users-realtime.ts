"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/providers/socket-provider";
import { useNotificationsContext } from "@/providers/notifications-provider";
import { useLocale } from "@/providers/locale-provider";
import { toast } from "sonner";

export function useUsersRealtime() {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const { add } = useNotificationsContext();
  const { t } = useLocale();

  useEffect(() => {
    if (!socket) return;

    console.log("[WS] Listening for user events...");

    const onCreated = (user: { name?: string }) => {
      console.log("[WS] user:created", user);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      const msg = t("notifications.user_created", { name: user.name || "" });
      toast.success(msg);
      add(msg, "created");
    };

    const onUpdated = (user: { name?: string }) => {
      console.log("[WS] user:updated", user);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      const msg = t("notifications.user_updated", { name: user.name || "" });
      toast.info(msg);
      add(msg, "updated");
    };

    const onDeleted = (data: { id: string }) => {
      console.log("[WS] user:deleted", data);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      const msg = t("notifications.user_deleted");
      toast.warning(msg);
      add(msg, "deleted");
    };

    socket.on("user:created", onCreated);
    socket.on("user:updated", onUpdated);
    socket.on("user:deleted", onDeleted);

    return () => {
      socket.off("user:created", onCreated);
      socket.off("user:updated", onUpdated);
      socket.off("user:deleted", onDeleted);
    };
  }, [socket, queryClient, add, t]);
}
