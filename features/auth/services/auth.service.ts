import api from "@/service/api";
import { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth.types";

export const authService = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>("/auth/login", data).then((res) => res.data),

  register: (data: RegisterRequest) =>
    api.post<AuthResponse>("/users/register", data).then((res) => res.data),

  me: () =>
    api.get<AuthResponse["user"]>("/users/me").then((res) => res.data),
};
