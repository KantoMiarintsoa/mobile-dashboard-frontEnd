import { IsEmail, MinLength } from "class-validator";

export class LoginFormData {
  @IsEmail({}, { message: "Email invalide" })
  email: string = "";

  @MinLength(6, { message: "Minimum 6 caractères" })
  password: string = "";
}
