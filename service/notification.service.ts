import api from "@/service/api";

export interface ApiNotification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  userId: string;
  createdAt: string;
}

export const notificationService = {
  getAll: () =>
    api.get<ApiNotification[]>("/notifications").then((res) => res.data),

  markAllRead: () =>
    api.patch("/notifications/read").then((res) => res.data),
};
