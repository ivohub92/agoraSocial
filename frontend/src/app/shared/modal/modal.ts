import { Component, ElementRef, HostListener, effect, inject, viewChild } from '@angular/core';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {
  protected readonly modal = inject(ModalService);

  protected readonly etiquetas = { exito: 'Listo', error: 'Error', info: 'Aviso' };

  private readonly boton = viewChild<ElementRef<HTMLButtonElement>>('boton');

  constructor() {
    // Al abrirse, el foco va al botón para poder cerrar con Enter.
    effect(() => this.boton()?.nativeElement.focus());
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.modal.actual()) this.modal.cerrar();
  }
}
