import { Routes } from '@angular/router';

// Sprint 1: navegación libre entre pantallas (los guards de sesión se agregan en el Sprint 3).
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    title: 'Iniciar sesión · Ágora',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    title: 'Crear cuenta · Ágora',
    loadComponent: () => import('./pages/registro/registro').then((m) => m.Registro),
  },
  {
    path: 'publicaciones',
    title: 'Publicaciones · Ágora',
    loadComponent: () =>
      import('./pages/publicaciones/publicaciones').then((m) => m.Publicaciones),
  },
  {
    path: 'mi-perfil',
    title: 'Mi perfil · Ágora',
    loadComponent: () => import('./pages/mi-perfil/mi-perfil').then((m) => m.MiPerfil),
  },
  { path: '**', redirectTo: 'login' },
];
