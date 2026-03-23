import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { LoginRequest } from "../types/auth.types";

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
    },
  });
}
