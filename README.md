# Ágora · Red social (Programación IV – TP 2)

| Carpeta     | Tecnología          |
|-------------|---------------------|
| `frontend/` | Angular 21 (diseño Ágora, sistema Modernist) |
| `backend/`  | NestJS 12 + MongoDB |

## Sprint 1 – qué incluye

**Front**
- Pantallas: Registro, Login, Publicaciones y Mi perfil, con navegación libre entre ellas (navbar).
- Favicon propio (`frontend/public/favicon.svg`).
- Login por **correo o nombre de usuario** (ambos únicos en la base) con validaciones y mensajes.
- Contraseña: mínimo 8 caracteres, una mayúscula y un número (validado en front y back).
- Registro con nombre, apellido, correo, nombre de usuario, contraseña, repetir contraseña,
  fecha de nacimiento, descripción breve e imagen de perfil (input `file` con vista previa).
- Mensajes en **modales** propios (nunca `alert()`).

**Back**
- Módulos `auth`, `users` (usuarios) y `publicaciones`.
- `POST /auth/registro` (multipart/form-data, archivo en el campo `imagenPerfil`):
  valida los datos, encripta la contraseña con bcrypt, guarda la imagen (en Vercel Blob,
  o en `uploads/` cuando se corre en local) y su URL en la base. Responde **201**; **400** si hay datos inválidos;
  **409** si el correo o el usuario ya existen.
- `POST /auth/login` (`{ identificador, password }`): compara la contraseña con bcrypt
  y devuelve todos los datos del usuario (sin la contraseña). **200** / **401** / **400**.
- Los usuarios tienen el atributo `perfil` (`usuario` por defecto, o `administrador`).

## Correr en local

```bash
# Backend (necesita MongoDB local o una URI de MongoDB Atlas en .env)
cd backend
cp .env.example .env
npm install
npm run start:dev          # http://localhost:3000

# Frontend
cd frontend
npm install
npm start                  # http://localhost:4200
```

## Deploy (todo en Vercel)

Se crean **dos proyectos de Vercel** desde el mismo repo de GitHub: uno para el backend y otro para el frontend.
Los `.npmrc` de cada carpeta ya hacen que Vercel instale con `legacy-peer-deps`.

### 1. Backend
1. vercel.com → **Add New → Project** → importar el repo.
2. **Root Directory**: `backend`. Vercel detecta NestJS solo (usa `src/main.ts`); no hace falta tocar nada más.
3. **Environment Variables**:
   - `MONGODB_URI` → la URI de Atlas (en Atlas, Network Access debe permitir `0.0.0.0/0`).
   - `CORS_ORIGIN` → por ahora `http://localhost:4200`; después, la URL del front.
4. **Deploy**.
5. Imágenes: en el proyecto del backend → **Storage → Create → Blob** → conectarlo al proyecto.
   Vercel agrega solo la variable `BLOB_READ_WRITE_TOKEN`. Hacer **Redeploy** para que la tome.
   Sin Blob store, el registro funciona pero falla al subir la imagen (en Vercel no se puede escribir en disco).

### 2. Frontend
1. Poner la URL del backend (ej. `https://agora-backend.vercel.app`) en
   `frontend/src/environments/environment.ts` y subir el cambio a GitHub.
2. vercel.com → **Add New → Project** → el mismo repo → **Root Directory**: `frontend`.
   Vercel detecta Angular solo. `vercel.json` ya resuelve que las rutas funcionen al recargar.
3. **Deploy**.
4. Volver al proyecto del backend → `CORS_ORIGIN` = URL del front
   (ej. `https://agora-frontend.vercel.app,http://localhost:4200`) → **Redeploy**.

> Límite de Vercel: los pedidos no pueden superar 4,5 MB, por eso la imagen de perfil admite hasta 4 MB.

## Postman

En `postman/red-social.postman_collection.json` hay una colección con las pruebas del Sprint 1
(registro OK, duplicado, contraseña inválida, contraseñas distintas, login por usuario y por correo,
login incorrecto y login vacío). Cada request verifica el status esperado.

1. En Postman: **Import** → elegir el archivo.
2. Con el backend corriendo, botón derecho sobre la colección → **Run collection**.
3. Para probar el backend desplegado, cambiar la variable `baseUrl` de la colección.

## Conectar MongoDB Atlas

1. En Atlas: crear el cluster → **Database Access**: crear un usuario con contraseña →
   **Network Access**: agregar `0.0.0.0/0` (necesario para Vercel).
2. **Connect → Drivers** y copiar la URI.
3. Pegarla en `backend/.env` agregando el nombre de la base antes del `?`:
   `MONGODB_URI=mongodb+srv://usuario:clave@cluster0.xxxxx.mongodb.net/red-social?retryWrites=true&w=majority`
4. `npm run start:dev`. La colección `users` se crea sola con el primer registro.
