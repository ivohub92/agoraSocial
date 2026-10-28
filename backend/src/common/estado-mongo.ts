/** Último error de conexión a MongoDB, para mostrarlo en GET / (ruta de salud). */
export const estadoMongo = { ultimoError: null as string | null };

/** Oculta usuario y contraseña de cualquier cadena de conexión que aparezca en un texto. */
export function ocultarCredenciales(texto: string): string {
  return texto.replace(/\/\/[^@\s/]+@/g, '//***:***@');
}
