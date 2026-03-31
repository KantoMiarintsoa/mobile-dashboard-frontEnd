import api from "@/service/api";
import { db } from "@/lib/db";
import { CreateUserDto, UpdateUserDto, User } from "@/types/user.types";

export const userService = {
  getAll: async (): Promise<User[]> => {
    try {
      const res = await api.get<User[]>("/users/list");
      await db.users.clear();
      await db.users.bulkPut(res.data);
      return res.data;
    } catch {
      return db.users.toArray();
    }
  },

  getById: async (id: string): Promise<User> => {
    try {
      const res = await api.get<User>(`/users/${id}/details`);
      await db.users.put(res.data);
      return res.data;
    } catch {
      return (await db.users.get(id))!;
    }
  },

  create: async (data: CreateUserDto): Promise<User> => {
    try {
      const res = await api.post<User>("/users/create", data);
      await db.users.put(res.data);
      return res.data;
    } catch {
      const tempUser: User = {
        id: `temp-${Date.now()}`,
        name: data.name,
        email: data.email,
        role: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await db.users.put(tempUser);
      await db.syncQueue.add({
        action: "create",
        endpoint: "/users/create",
        method: "POST",
        data: data as unknown,
        timestamp: Date.now(),
      });
      return tempUser;
    }
  },

  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    try {
      const res = await api.put<User>(`/users/${id}/update`, data);
      await db.users.put(res.data);
      return res.data;
    } catch {
      const existing = await db.users.get(id);
      const updated = { ...existing!, ...data, updatedAt: new Date().toISOString() };
      await db.users.put(updated);
      await db.syncQueue.add({
        action: "update",
        endpoint: `/users/${id}/update`,
        method: "PUT",
        data: data as unknown,
        timestamp: Date.now(),
      });
      return updated;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/users/${id}/delete`);
    } catch {
      await db.syncQueue.add({
        action: "delete",
        endpoint: `/users/${id}/delete`,
        method: "DELETE",
        timestamp: Date.now(),
      });
    }
    await db.users.delete(id);
  },
};