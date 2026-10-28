export type Perfil = 'usuario' | 'administrador';

export interface Usuario {
  _id: string;
  nombre: string;
  apellido: string;
  correo: string;
  nombreUsuario: string;
  fechaNacimiento: string;
  descripcion: string;
  imagenPerfil: string | null;
  perfil: Perfil;
  activo: boolean;
  createdAt: string;
}

export interface LoginRequest {
  identificador: string;
  password: string;
}

/** Forma de los errores que devuelve NestJS. */
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
