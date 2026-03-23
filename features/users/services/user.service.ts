import api from "@/service/api";
import { CreateUserDto, UpdateUserDto, User } from "../types/user.types";

export const userService = {
  getAll: () =>
    api.get<User[]>("/users/list").then((res) => res.data),

  getById: (id: string) =>
    api.get<User>(`/users/${id}/details`).then((res) => res.data),

  create: (data: CreateUserDto) =>
    api.post<User>("/users/register", data).then((res) => res.data),

  update: (id: string, data: UpdateUserDto) =>
    api.put<User>(`/users/${id}/update`, data).then((res) => res.data),

  delete: (id: string) =>
    api.delete(`/users/${id}/delete`).then((res) => res.data),
};
