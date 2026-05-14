# Guía de Configuración: Contador de Usuarios Online

Sigue estos pasos para habilitar el almacenamiento y la seguridad en tu proyecto de Vercel.

### 1. Inicializar Vercel KV
1. Ve al panel de control de tu proyecto en [vercel.com](https://vercel.com).
2. Haz clic en la pestaña **Storage**.
3. Selecciona **KV** (Redis) y haz clic en **Create**.
4. Sigue los pasos para aceptar los términos y crear la base de datos.
5. Una vez creada, haz clic en **Connect** y selecciona tu proyecto actual. Esto inyectará automáticamente las variables de entorno necesarias (`KV_URL`, `KV_REST_API_URL`, etc.).

### 2. Configurar el Secreto de Autenticación
Para proteger el endpoint de actualizaciones, necesitamos una clave secreta que solo tu servidor de juego conozca.

1. En el panel de tu proyecto en Vercel, ve a **Settings** > **Environment Variables**.
2. Añade una nueva variable:
   - **Key:** `AUTH_SECRET`
   - **Value:** Una cadena aleatoria y segura (ej: `Trhynum_Secure_2024_Token_XYZ`).
3. Haz clic en **Save**.
4. *Recuerda usar este mismo valor en el script de tu VPS al hacer el POST.*

### 3. Instalación de Dependencias
Asegúrate de tener el SDK de Vercel KV instalado en tu proyecto:

```bash
npm install @vercel/kv
```

### 4. Uso en el Servidor de Juego (VPS)
El servidor de juego debe enviar un JSON similar a este cada 2 minutos:

```json
{
  "secret": "TU_VALOR_DE_AUTH_SECRET",
  "onlines": 42
}
```
Método: **POST**  
URL: `https://tu-dominio.com/api/update-onlines`
