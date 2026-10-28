import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface.js';
import { put } from '@vercel/blob';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { memoryStorage } from 'multer';

export const UPLOADS_DIR = join(process.cwd(), 'uploads');

/**
 * En Vercel el disco no es persistente, así que ahí las imágenes van a Vercel Blob
 * (que se autentica con BLOB_STORE_ID o BLOB_READ_WRITE_TOKEN); en local, a /uploads.
 */
export const usaVercelBlob = () =>
  Boolean(
    process.env.VERCEL ||
      process.env.BLOB_STORE_ID ||
      process.env.BLOB_READ_WRITE_TOKEN,
  );

/**
 * La imagen se mantiene en memoria y solo se guarda cuando el resto de los datos
 * ya fueron validados (así no quedan archivos huérfanos). Límite de 4 MB porque
 * Vercel no acepta pedidos de más de 4,5 MB.
 */
export const imageUploadOptions: MulterOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) {
      return cb(
        new BadRequestException('La imagen debe ser JPG, PNG, WEBP o GIF'),
        false,
      );
    }
    cb(null, true);
  },
};

/** Guarda la imagen y devuelve su URL pública. */
export async function saveImage(
  file: Express.Multer.File,
  carpeta = 'perfiles',
): Promise<string> {
  const filename = `${randomUUID()}${extname(file.originalname).toLowerCase()}`;

  if (usaVercelBlob()) {
    const blob = await put(`${carpeta}/${filename}`, file.buffer, {
      access: 'public',
      contentType: file.mimetype,
    });
    return blob.url;
  }

  await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(join(UPLOADS_DIR, filename), file.buffer);
  const baseUrl = process.env.PUBLIC_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;
  return `${baseUrl}/uploads/${filename}`;
}
