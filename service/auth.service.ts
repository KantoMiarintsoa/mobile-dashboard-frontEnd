import api from "@/service/api";
import { AuthResponse, LoginRequest } from "../features/auth/types/auth.types";

export const authService = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>("/auth/login", data).then((res) => res.data),

  me: () =>
    api.get("/users/me").then((res) => res.data),
};
