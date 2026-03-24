import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { authService } from "../../../service/auth.service";
import { RegisterRequest } from "../types/auth.types";

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any) => {
      const token = data.access_token || data.token || data.accessToken;
      if (token) {
        Cookies.set("token", token, { expires: 7 });
      }
    },
  });
}
