import { useQuery } from "@tanstack/react-query";
import { userService } from "../../../service/user.service";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
}
