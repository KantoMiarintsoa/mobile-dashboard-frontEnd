"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSocket } from "@/providers/socket-provider";
import { useMe } from "@/features/auth/hooks/use-me";

interface OnlineUser {
  id: string;
  name: string;
}

interface PresenceContextType {
  onlineUsers: OnlineUser[];
  isOnline: (userId: string) => boolean;
}

const PresenceContext = createContext<PresenceContextType>({
  onlineUsers: [],
  isOnline: () => false,
});

export function usePresence() {
  return useContext(PresenceContext);
}

export default function PresenceProvider({ children }: { children: React.ReactNode }) {
  const socket = useSocket();
  const { data: me } = useMe();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  // Send presence when socket + user are ready
  useEffect(() => {
    if (!socket || !me) return;

    socket.emit("presence:join", { userId: me.id, userName: me.name });

    const onUpdate = (users: OnlineUser[]) => {
      setOnlineUsers(users);
    };

    socket.on("presence:update", onUpdate);

    return () => {
      socket.off("presence:update", onUpdate);
    };
  }, [socket, me]);

  const isOnline = useCallback(
    (userId: string) => onlineUsers.some((u) => u.id === userId),
    [onlineUsers],
  );

  return (
    <PresenceContext.Provider value={{ onlineUsers, isOnline }}>
      {children}
    </PresenceContext.Provider>
  );
}
