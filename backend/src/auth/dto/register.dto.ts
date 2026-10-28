import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
export const PASSWORD_MENSAJE =
  'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(50)
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @MaxLength(50)
  apellido: string;

  @IsEmail({}, { message: 'El correo no es válido' })
  correo: string;

  @IsString()
  @MinLength(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' })
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9._]+$/, {
    message: 'El nombre de usuario solo puede tener letras, números, puntos y guiones bajos',
  })
  nombreUsuario: string;

  @IsString()
  @Matches(PASSWORD_REGEX, { message: PASSWORD_MENSAJE })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Debe repetir la contraseña' })
  repetirPassword: string;

  @IsDateString({}, { message: 'La fecha de nacimiento no es válida' })
  fechaNacimiento: string;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'La descripción no puede superar los 200 caracteres' })
  descripcion?: string;
}
