import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { calcularEdad } from '../../core/fechas';
import { Avatar } from '../../shared/avatar/avatar';

// Sprint 1: estructura de la pantalla. El listado, el alta y los "me gusta" llegan en el Sprint 2.
@Component({
  selector: 'app-publicaciones',
  imports: [RouterLink, DatePipe, Avatar],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.scss',
})
export class Publicaciones {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly edad = computed(() => {
    const u = this.auth.usuario();
    return u ? calcularEdad(u.fechaNacimiento) : null;
  });

  protected salir(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
