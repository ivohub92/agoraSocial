import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, mensajeDeError } from '../../core/auth.service';
import { PASSWORD_PATTERN } from '../../core/validators';
import { ModalService } from '../../shared/modal/modal.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styles: `
    .auth {
      grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
    }
    .auth-form {
      max-width: 620px;
    }
    form {
      max-width: 420px;
    }
    .headline {
      font-size: clamp(40px, 5.2vw, 76px);
      line-height: 0.96;
    }
    .poster p {
      margin: 0;
      max-width: 34ch;
      font-size: 16px;
      line-height: 1.5;
    }
    .pilares {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .pilares b {
      display: block;
      font-family: var(--font-heading);
      font-size: 24px;
    }
    .pilares span {
      font-size: 11px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    @media (max-width: 560px) {
      .pilares {
        grid-template-columns: minmax(0, 1fr);
        gap: 12px;
      }
    }
  `,
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly modal = inject(ModalService);
  private readonly router = inject(Router);

  protected readonly enviando = signal(false);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    identificador: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]],
  });

  protected invalido(campo: 'identificador' | 'password'): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || c.dirty);
  }

  protected enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.auth.login(this.form.getRawValue()).subscribe({
      next: (usuario) => {
        this.enviando.set(false);
        this.modal.exito(`Hola, ${usuario.nombre}`, 'Iniciaste sesión correctamente.', () =>
          this.router.navigateByUrl('/publicaciones'),
        );
      },
      error: (err) => {
        this.enviando.set(false);
        this.modal.error('No se pudo iniciar sesión', mensajeDeError(err));
      },
    });
  }
}
