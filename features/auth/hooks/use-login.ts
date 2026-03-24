import { useMutation } from "@tanstack/react-query";
import { authService } from "../../../service/auth.service";
import { LoginRequest } from "../types/auth.types";

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any) => {
      console.log("Login response:", data);
      const token = data.access_token || data.token || data.accessToken;
      if (token) {
        localStorage.setItem("token", token);
      }
    },
  });
}
