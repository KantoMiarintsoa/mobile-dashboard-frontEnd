import api from "@/service/api";

export interface ApiNotification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  userId: string;
  createdAt: string;
}

export interface DayStat {
  date: string;
  created: number;
  updated: number;
  deleted: number;
}

export const notificationService = {
  getAll: () =>
    api.get<ApiNotification[]>("/notifications").then((res) => res.data),

  getStats: (days = 7) =>
    api.get<DayStat[]>(`/notifications/stats?days=${days}`).then((res) => res.data),

  markAllRead: () =>
    api.patch("/notifications/read").then((res) => res.data),
};
