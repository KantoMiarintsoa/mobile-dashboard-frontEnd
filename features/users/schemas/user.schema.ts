import { IsEmail, IsOptional, MinLength } from "class-validator";

export class CreateUserFormData {
  @MinLength(2, { message: "Minimum 2 caractères" })
  name: string = "";

  @IsEmail({}, { message: "Email invalide" })
  email: string = "";

  @MinLength(6, { message: "Minimum 6 caractères" })
  password: string = "";

  @MinLength(1, { message: "Rôle requis" })
  role: string = "";
}

export class UpdateUserFormData {
  @IsOptional()
  @MinLength(2, { message: "Minimum 2 caractères" })
  name?: string = "";

  @IsOptional()
  @IsEmail({}, { message: "Email invalide" })
  email?: string = "";

  @IsOptional()
  @MinLength(1, { message: "Rôle requis" })
  role?: string = "";
}
