import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { calcularEdad } from '../../core/fechas';
import { Avatar } from '../../shared/avatar/avatar';

@Component({
  selector: 'app-mi-perfil',
  imports: [RouterLink, DatePipe, Avatar],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.scss',
})
export class MiPerfil {
  protected readonly auth = inject(AuthService);

  protected readonly edad = computed(() => {
    const u = this.auth.usuario();
    return u ? calcularEdad(u.fechaNacimiento) : null;
  });
}
