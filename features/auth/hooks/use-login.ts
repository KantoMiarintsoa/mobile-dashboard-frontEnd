import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { authService } from "../../../service/auth.service";
import { LoginRequest } from "../types/auth.types";

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any) => {
      const token = data.access_token || data.token || data.accessToken;
      if (token) {
        Cookies.set("token", token, { expires: 7 });
      }
    },
  });
}
