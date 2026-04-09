import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../../service/user.service";
import { CreateUserDto, UpdateUserDto } from "../../../types/user.types";

function useInvalidateAll() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
    // Small delay to let the backend create the notification before refetching
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["activity-stats"] });
    }, 500);
  };
}

export function useCreateUser() {
  const invalidateAll = useInvalidateAll();
  return useMutation({
    mutationFn: (data: CreateUserDto) => userService.create(data),
    onSuccess: invalidateAll,
  });
}

export function useUpdateUser() {
  const invalidateAll = useInvalidateAll();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      userService.update(id, data),
    onSuccess: invalidateAll,
  });
}

export function useDeleteUser() {
  const invalidateAll = useInvalidateAll();
  return useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: invalidateAll,
  });
}

export function useDeleteAllUsers() {
  const invalidateAll = useInvalidateAll();
  return useMutation({
    mutationFn: () => userService.deleteAll(),
    onSuccess: invalidateAll,
  });
}
