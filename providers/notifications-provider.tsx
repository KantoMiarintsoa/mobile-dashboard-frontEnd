"use client";

import { createContext, useContext } from "react";
import { useNotifications, Notification } from "@/hooks/use-notifications";

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  add: (message: string, type: Notification["type"]) => void;
  markAllRead: () => void;
  clear: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export function useNotificationsContext() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotificationsContext must be used within NotificationsProvider");
  return ctx;
}

export default function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const value = useNotifications();

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}
