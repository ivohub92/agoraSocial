import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Al menos 8 caracteres, una mayúscula y un número (misma regla que el backend). */
export const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

/** Valida que dos controles del grupo tengan el mismo valor. */
export function coincidenValidator(campo: string, confirmacion: string): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const a = grupo.get(campo)?.value;
    const b = grupo.get(confirmacion)?.value;
    return a && b && a !== b ? { noCoinciden: true } : null;
  };
}

/** La fecha no puede ser futura y el usuario debe tener al menos `minimo` años. */
export function edadMinimaValidator(minimo: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const fecha = new Date(control.value);
    if (isNaN(fecha.getTime())) return { fechaInvalida: true };
    const limite = new Date();
    limite.setFullYear(limite.getFullYear() - minimo);
    return fecha > limite ? { edadMinima: { minimo } } : null;
  };
}
