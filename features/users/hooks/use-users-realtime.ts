"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/providers/socket-provider";
import { useNotificationsContext } from "@/providers/notifications-provider";
import { toast } from "sonner";

export function useUsersRealtime() {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const { add } = useNotificationsContext();

  useEffect(() => {
    if (!socket) return;

    const onCreated = (data: { name?: string; notification?: { message: string } }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      const msg = data.notification?.message || `User ${data.name} created`;
      toast.success(msg);
      add(msg, "created");
    };

    const onUpdated = (data: { name?: string; notification?: { message: string } }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      const msg = data.notification?.message || `User ${data.name} updated`;
      toast.info(msg);
      add(msg, "updated");
    };

    const onDeleted = (data: { id: string; actorName?: string; targetName?: string }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      const msg = data.actorName && data.targetName
        ? `${data.actorName} deleted ${data.targetName}`
        : "A user has been deleted";
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
  }, [socket, queryClient, add]);
}
