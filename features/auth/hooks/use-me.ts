import { useQuery } from "@tanstack/react-query";
import { authService } from "@/service/auth.service";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: authService.me,
  });
}
