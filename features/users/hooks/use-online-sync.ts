"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { replayQueue } from "@/lib/sync";
import { useUsersRealtime } from "./use-users-realtime";

export function useOnlineSync() {
  const queryClient = useQueryClient();

  // Replay pending actions when back online
  useEffect(() => {
    const handleOnline = async () => {
      await replayQueue();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [queryClient]);

  // Live updates via WebSocket
  useUsersRealtime();
}