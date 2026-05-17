# Guía: Cómo resolver el Dominio de nic.ar con Vercel

Actualmente tu dominio `trhynumao.com.ar` tiene delegados los servidores de nombres (DNS) de Vercel:
* `ns1.vercel-dns.com`
* `ns2.vercel-dns.com`

Como el dominio está enlazado a una **cuenta de Vercel anterior o ajena**, no puedes entrar a los registros DNS de esa cuenta para poner el código `TXT` de verificación. Y como **nic.ar** solo permite delegar servidores de nombres (no deja añadir registros TXT directamente), te encuentras en un bloqueo.

Tienes dos opciones claras para solucionarlo dependiendo de si tienes acceso o no a la cuenta de Vercel vieja:

---

## Opción A: Si tienes acceso a la cuenta vieja de Vercel (La más rápida)

Si recuerdas el usuario/contraseña de la cuenta de Vercel donde estaba el dominio anteriormente:

1. Inicia sesión en la **cuenta vieja de Vercel**.
2. Ve al proyecto donde estaba el dominio, ve a **Settings** > **Domains**.
3. Haz clic en **"Remove"** (Eliminar) en los dominios `trhynumao.com.ar` y `www.trhynumao.com.ar`.
4. Una vez eliminados de la cuenta vieja, ve a tu **cuenta nueva de Vercel** y haz clic en **"Refresh"**.
5. ¡Listo! Se activará inmediatamente sin pedirte ninguna verificación adicional.

---

## Opción B: Si NO tienes acceso a la cuenta vieja de Vercel (Recomendado usando Cloudflare)

Si no tienes acceso a la cuenta anterior de Vercel, la solución estándar y profesional es usar **Cloudflare** como intermediario gratuito para manejar tus DNS (esto además te permitirá tener registros de correo TXT, MX, etc., en el futuro, algo que nic.ar no permite por sí solo).

### Paso 1: Crear una cuenta en Cloudflare
1. Regístrate gratis en [Cloudflare](https://dash.cloudflare.com/).
2. Haz clic en **"Add a Site"** (Añadir un sitio) e ingresa: `trhynumao.com.ar`.
3. Selecciona el **Plan Gratuito** ($0).
4. Cloudflare escaneará tu dominio. Haz clic en continuar hasta que te muestre tus **Nuevos Servidores de Nombres** (ejemplo: `alex.ns.cloudflare.com` y `olga.ns.cloudflare.com`).

### Paso 2: Cambiar la delegación en nic.ar
1. Inicia sesión en [nic.ar](https://nic.ar/).
2. Ve a **"Mis Dominios"** y busca `trhynumao.com.ar`.
3. Haz clic en **"Delegar"**.
4. Elimina los servidores de nombres de Vercel (`ns1.vercel-dns.com`, etc.) y agrega los **dos servidores de nombres que te dio Cloudflare** en el Paso 1.
5. Guarda los cambios en nic.ar. *(Nota: La propagación de nic.ar puede demorar entre 1 y 4 horas).*

### Paso 3: Agregar el registro TXT en Cloudflare
1. Una vez que Cloudflare te indique que tu sitio está activo (te llegará un mail), ve al panel de Cloudflare de tu dominio.
2. Ve a la sección **DNS** > **Records** (Registros) y haz clic en **Add Record**.
3. Crea el registro de verificación de Vercel:
   * **Type (Tipo):** `TXT`
   * **Name (Nombre):** `_vercel`
   * **Content / Value (Valor):** Pega el código de verificación que te da tu Vercel actual (`vc-domain-verify=...`).
4. Haz clic en **Save** (Guardar).

### Paso 4: Apuntar tu web a Vercel desde Cloudflare
Para que la web cargue correctamente, debes agregar estos dos registros también en la sección DNS de **Cloudflare**:
1. **Primer registro (Para trhynumao.com.ar):**
   * **Type (Tipo):** `A`
   * **Name (Nombre):** `@`
   * **IPv4 Address:** `76.76.21.21` (IP oficial de Vercel)
   * **Proxy Status:** Desactívalo (déjalo en **"DNS Only" / Gris**, haciendo clic sobre la nube naranja) para que Vercel pueda emitir el certificado SSL sin problemas.
2. **Segundo registro (Para www.trhynumao.com.ar):**
   * **Type (Tipo):** `CNAME`
   * **Name (Nombre):** `www`
   * **Target (Destino):** `cname.vercel-dns.com`
   * **Proxy Status:** Desactívalo (déjalo en **"DNS Only" / Gris**).

### Paso 5: Confirmar en Vercel
1. Regresa a tu panel de **Vercel** actual.
2. Haz clic en el botón **"Refresh"** en la sección de dominios.
3. ¡Felicidades! Tu dominio quedará verificado y tu web estará online y segura.
