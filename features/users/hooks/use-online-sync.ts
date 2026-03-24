"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { replayQueue } from "@/lib/sync";

export function useOnlineSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleOnline = async () => {
      await replayQueue();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [queryClient]);
}