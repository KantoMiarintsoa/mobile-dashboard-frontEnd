"use client";

import { use } from "react";
import { EditUserForm } from "@/features/users/components/edit-user-form";

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <EditUserForm id={id} />;
}
