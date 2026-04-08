import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterFormData {
  @IsNotEmpty({ message: "Le nom est requis" })
  @MinLength(2, { message: "Minimum 2 caractères" })
  name: string = "";

  @IsEmail({}, { message: "Email invalide" })
  email: string = "";

  @MinLength(6, { message: "Minimum 6 caractères" })
  password: string = "";
}
