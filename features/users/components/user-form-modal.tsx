"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { toast } from "sonner";
import { useCreateUser, useUpdateUser } from "@/features/users/hooks/use-user-mutations";
import { CreateUserFormData, UpdateUserFormData } from "@/features/users/schemas/user.schema";
import { useLocale } from "@/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  user?: { id: string; name: string; email: string };
}

const createResolver = classValidatorResolver(CreateUserFormData);
const updateResolver = classValidatorResolver(UpdateUserFormData);

export function UserFormModal({ open, onClose, mode, user }: UserFormModalProps) {
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { t } = useLocale();

  const isEdit = mode === "edit";
  const isPending = isEdit ? isUpdating : isCreating;

  const createForm = useForm<CreateUserFormData>({ resolver: createResolver });
  const editForm = useForm<UpdateUserFormData>({ resolver: updateResolver });

  useEffect(() => {
    if (open && isEdit && user) {
      editForm.reset({ name: user.name, email: user.email });
    }
    if (open && !isEdit) {
      createForm.reset({ name: "", email: "", password: "", role: "VIEWER" });
    }
  }, [open, isEdit, user, editForm, createForm]);

  const onSubmit = isEdit
    ? editForm.handleSubmit((data) => {
        updateUser(
          { id: user!.id, data: { name: data.name, email: data.email } },
          {
            onSuccess: () => { toast.success(t("users.edit_success")); onClose(); },
            onError: () => { toast.error(t("users.edit_error")); },
          },
        );
      })
    : createForm.handleSubmit((data) => {
        createUser(
          { name: data.name, email: data.email, password: data.password },
          {
            onSuccess: () => { toast.success(t("users.create_success")); onClose(); },
            onError: () => { toast.error(t("users.create_error")); },
          },
        );
      });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? t("users.edit_title") : t("users.create")}</DialogTitle>
          <DialogDescription>
            {isEdit ? t("users.edit_subtitle") : t("users.create_subtitle")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {isEdit ? (
            <>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="modal-name">{t("users.name")}</Label>
                <Input id="modal-name" {...editForm.register("name")} />
                {editForm.formState.errors.name && (
                  <p className="text-sm text-red-500">{editForm.formState.errors.name.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="modal-email">{t("users.email")}</Label>
                <Input id="modal-email" type="email" {...editForm.register("email")} disabled className="opacity-50" />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="modal-name">{t("users.name")}</Label>
                <Input id="modal-name" {...createForm.register("name")} />
                {createForm.formState.errors.name && (
                  <p className="text-sm text-red-500">{createForm.formState.errors.name.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="modal-email">{t("users.email")}</Label>
                <Input id="modal-email" type="email" {...createForm.register("email")} />
                {createForm.formState.errors.email && (
                  <p className="text-sm text-red-500">{createForm.formState.errors.email.message}</p>
                )}
              </div>
            </>
          )}
          {!isEdit && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="modal-password">{t("users.password")}</Label>
              <PasswordInput id="modal-password" {...createForm.register("password")} />
              {createForm.formState.errors.password && (
                <p className="text-sm text-red-500">{createForm.formState.errors.password.message}</p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>{t("common.cancel")}</Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? t("users.creating")
                : isEdit ? t("users.save") : t("users.create_btn")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
