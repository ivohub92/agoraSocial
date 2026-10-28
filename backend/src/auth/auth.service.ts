import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { saveImage } from '../common/image-upload.js';
import { UsersService } from '../users/users.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(dto: RegisterDto, imagen?: Express.Multer.File) {
    if (dto.password !== dto.repetirPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const existente = await this.usersService.existsByCorreoOrNombreUsuario(
      dto.correo,
      dto.nombreUsuario,
    );
    if (existente) {
      throw new ConflictException(
        existente.correo === dto.correo.toLowerCase()
          ? 'El correo ya está registrado'
          : 'El nombre de usuario ya está en uso',
      );
    }

    const { repetirPassword: _, password, ...datos } = dto;
    const user = await this.usersService.create({
      ...datos,
      fechaNacimiento: new Date(dto.fechaNacimiento),
      password: await bcrypt.hash(password, SALT_ROUNDS),
      imagenPerfil: imagen ? await saveImage(imagen) : null,
    });
    return user.toJSON();
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByIdentificador(dto.identificador);
    // bcrypt.compare encripta la contraseña recibida con el salt guardado y compara los hashes.
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }
    return user.toJSON();
  }
}
