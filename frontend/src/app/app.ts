import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { Navbar } from './layout/navbar/navbar';
import { Modal } from './shared/modal/modal';

const RUTAS_SIN_NAVBAR = ['/login', '/registro'];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Modal],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly router = inject(Router);

  protected readonly mostrarNavbar = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => !RUTAS_SIN_NAVBAR.some((r) => e.urlAfterRedirects.startsWith(r))),
    ),
    { initialValue: false },
  );
}
