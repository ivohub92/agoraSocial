import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageUploadOptions } from '../common/image-upload.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** POST /auth/registro (multipart/form-data, campo de archivo: "imagenPerfil") → 201 */
  @Post('registro')
  @UseInterceptors(FileInterceptor('imagenPerfil', imageUploadOptions))
  register(
    @Body() dto: RegisterDto,
    @UploadedFile() imagen?: Express.Multer.File,
  ) {
    return this.authService.register(dto, imagen);
  }

  /** POST /auth/login → 200 con los datos del usuario, 401 si las credenciales no son válidas */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
