import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  /** Correo o nombre de usuario. */
  @IsString()
  @IsNotEmpty({ message: 'Ingrese su correo o nombre de usuario' })
  identificador: string;

  @IsString()
  @IsNotEmpty({ message: 'Ingrese su contraseña' })
  password: string;
}
