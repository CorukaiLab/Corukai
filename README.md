# CoruKai web

Beta funcional de la librería sensorial CoruKai.

## Incluye

- Home editorial.
- Catálogo de 12 historias.
- Búsqueda y filtros.
- Fichas de producto.
- Cesta persistente en el navegador.
- Endpoint de checkout con validación server-side.
- Studio y esquema de Sanity.
- Protección privada mediante contraseña.
- Vercel Analytics y Speed Insights.

## Desarrollo

```bash
npm run dev
```

La URL predeterminada es [http://localhost:3000](http://localhost:3000).

## Variables

Copia los nombres de `.env.example` en `.env.local` y completa únicamente los valores necesarios.

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `NEXT_PUBLIC_SITE_URL`
- `CORUKAI_SITE_PASSWORD`
- `STRIPE_SECRET_KEY`

La clave de Stripe es privada y nunca debe empezar por `NEXT_PUBLIC_`.

## Calidad

```bash
npm run lint
npm run build
npm run sanity:validate
```

## Producción

- Repositorio: `CorukaiLab/Corukai`
- Vercel: `corukailab/corukai`
- Sanity Project ID: `eig4gq4g`
- Dataset: `production`
- Studio: `/studio`

El checkout devuelve un estado controlado mientras `STRIPE_SECRET_KEY` esté vacío. Antes de cobrar hay que completar Stripe, logística, condiciones de compra, privacidad y la revisión legal del precio fijo del libro.
