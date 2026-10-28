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
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
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
