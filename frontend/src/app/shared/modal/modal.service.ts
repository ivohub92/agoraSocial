import { Injectable, signal } from '@angular/core';

export type TipoModal = 'exito' | 'error' | 'info';

export interface DatosModal {
  tipo: TipoModal;
  titulo: string;
  mensaje: string;
  textoBoton?: string;
  alCerrar?: () => void;
}

/** Reemplaza a alert(): cualquier componente puede abrir un modal con un mensaje. */
@Injectable({ providedIn: 'root' })
export class ModalService {
  readonly actual = signal<DatosModal | null>(null);

  abrir(datos: DatosModal): void {
    this.actual.set(datos);
  }

  exito(titulo: string, mensaje: string, alCerrar?: () => void): void {
    this.abrir({ tipo: 'exito', titulo, mensaje, alCerrar });
  }

  error(titulo: string, mensaje: string): void {
    this.abrir({ tipo: 'error', titulo, mensaje });
  }

  cerrar(): void {
    const datos = this.actual();
    this.actual.set(null);
    datos?.alCerrar?.();
  }
}
