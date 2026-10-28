import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module.js';
import { UPLOADS_DIR, usaVercelBlob } from './common/image-upload.js';
import { PublicacionesModule } from './publicaciones/publicaciones.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uri = config.get<string>('MONGODB_URI')?.trim();
        if (!uri) {
          if ('MONGODB_URI' in process.env) {
            throw new Error('La variable de entorno MONGODB_URI existe pero está vacía.');
          }
          // Solo se muestran nombres de variables, nunca sus valores.
          const parecidas = Object.keys(process.env).filter((k) => /mongo|uri/i.test(k));
          throw new Error(
            `Falta la variable de entorno MONGODB_URI. ` +
              `Variables con nombre parecido: ${parecidas.join(', ') || 'ninguna'}`,
          );
        }
        // Pocos reintentos y timeout corto: si la conexión falla, el error aparece rápido.
        return { uri, retryAttempts: 2, serverSelectionTimeoutMS: 10_000 };
      },
    }),
    // En local las imágenes se sirven desde /uploads; en Vercel las sirve Vercel Blob.
    ...(usaVercelBlob()
      ? []
      : [ServeStaticModule.forRoot({ rootPath: UPLOADS_DIR, serveRoot: '/uploads' })]),
    UsersModule,
    AuthModule,
    PublicacionesModule,
  ],
})
export class AppModule {}
