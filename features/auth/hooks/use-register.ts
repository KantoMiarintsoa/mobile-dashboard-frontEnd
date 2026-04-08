import { useMutation } from "@tanstack/react-query";
import { authService } from "../../../service/auth.service";
import { RegisterRequest } from "../types/auth.types";

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
  });
}
