import { IsEmail, MinLength, Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";

@ValidatorConstraint({ name: "matchPasswords", async: false })
class MatchPasswordsConstraint implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments): boolean {
    const obj = args.object as RegisterFormData;
    return confirmPassword === obj.password;
  }

  defaultMessage(): string {
    return "Les mots de passe ne correspondent pas";
  }
}

export class RegisterFormData {
  @MinLength(2, { message: "Minimum 2 caractères" })
  name: string = "";

  @IsEmail({}, { message: "Email invalide" })
  email: string = "";

  @MinLength(6, { message: "Minimum 6 caractères" })
  password: string = "";

  @Validate(MatchPasswordsConstraint)
  confirmPassword: string = "";
}
