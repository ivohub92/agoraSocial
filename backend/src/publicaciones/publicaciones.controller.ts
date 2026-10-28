import { Controller } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service.js';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}
}
