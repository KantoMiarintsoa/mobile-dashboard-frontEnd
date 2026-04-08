"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";
import { toast } from "sonner";
import { useCreateUser, useUpdateUser } from "@/features/users/hooks/use-user-mutations";
import { CreateUserFormData, UpdateUserFormData } from "@/features/users/schemas/user.schema";
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
        const formData = new FormData();
        if (data.name) formData.append("name", data.name);
        if (data.email) formData.append("email", data.email);
        updateUser(
          {
            id: user!.id,
            data: {
              name: formData.get("name") as string | undefined,
              email: formData.get("email") as string | undefined,
            },
          },
          {
            onSuccess: () => {
              toast.success("Utilisateur modifié avec succès");
              onClose();
            },
            onError: () => {
              toast.error("Erreur lors de la modification");
            },
          },
        );
      })
    : createForm.handleSubmit((data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        createUser(
          {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
          },
          {
            onSuccess: () => {
              toast.success("Utilisateur créé avec succès");
              onClose();
            },
            onError: () => {
              toast.error("Erreur lors de la création");
            },
          },
        );
      });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Modifiez les informations de l'utilisateur." : "Remplissez les informations du nouvel utilisateur."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {isEdit ? (
            <>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="modal-name">Nom</Label>
                <Input id="modal-name" {...editForm.register("name")} />
                {editForm.formState.errors.name && (
                  <p className="text-sm text-red-500">{editForm.formState.errors.name.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="modal-email">Email</Label>
                <Input id="modal-email" type="email" {...editForm.register("email")} disabled className="opacity-50" />
                {editForm.formState.errors.email && (
                  <p className="text-sm text-red-500">{editForm.formState.errors.email.message}</p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="modal-name">Nom</Label>
                <Input id="modal-name" {...createForm.register("name")} />
                {createForm.formState.errors.name && (
                  <p className="text-sm text-red-500">{createForm.formState.errors.name.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="modal-email">Email</Label>
                <Input id="modal-email" type="email" {...createForm.register("email")} />
                {createForm.formState.errors.email && (
                  <p className="text-sm text-red-500">{createForm.formState.errors.email.message}</p>
                )}
              </div>
            </>
          )}
          {!isEdit && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="modal-password">Mot de passe</Label>
              <PasswordInput id="modal-password" {...createForm.register("password")} />
              {createForm.formState.errors.password && (
                <p className="text-sm text-red-500">{createForm.formState.errors.password.message}</p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEdit ? "Mise à jour..." : "Création..."
                : isEdit ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
