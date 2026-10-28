import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiError, LoginRequest, Usuario } from './models';

const STORAGE_KEY = 'usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/auth`;

  private readonly _usuario = signal<Usuario | null>(this.leerUsuarioGuardado());
  readonly usuario = this._usuario.asReadonly();
  readonly logueado = computed(() => this._usuario() !== null);

  registro(datos: FormData): Observable<Usuario> {
    return this.http
      .post<Usuario>(`${this.url}/registro`, datos)
      .pipe(tap((u) => this.guardarUsuario(u)));
  }

  login(datos: LoginRequest): Observable<Usuario> {
    return this.http
      .post<Usuario>(`${this.url}/login`, datos)
      .pipe(tap((u) => this.guardarUsuario(u)));
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this._usuario.set(null);
  }

  private guardarUsuario(usuario: Usuario): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
    this._usuario.set(usuario);
  }

  private leerUsuarioGuardado(): Usuario | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Usuario) : null;
    } catch {
      return null;
    }
  }
}

/** Convierte un error HTTP en un mensaje legible para mostrar en un modal. */
export function mensajeDeError(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) {
      return 'No se pudo conectar con el servidor. Intente nuevamente más tarde.';
    }
    const body = err.error as ApiError | null;
    if (body?.message) {
      return Array.isArray(body.message) ? body.message.join('\n') : body.message;
    }
  }
  return 'Ocurrió un error inesperado.';
}
