# CoruKai web

Beta funcional de la librería sensorial CoruKai.

## Incluye

- Home editorial.
- Catálogo de 24 historias.
- Balda editorial independiente con tres recomendaciones temporales de Coru.
- Búsqueda y filtros.
- Fichas de producto.
- Cesta persistente en el navegador.
- Estante local y salida transparente hacia Amazon Afiliados.
- Endpoint de Stripe reservado para una futura venta directa.
- Studio y esquema de Sanity.
- Protección privada mediante contraseña.
- Vercel Analytics y Speed Insights.

## Fuente de contenido

Sanity (`eig4gq4g`, dataset `production`) es la única fuente de contenido en ejecución. Home, Biblioteca, fichas, cesta y validación de checkout consultan los mismos 27 registros: 24 libros de catálogo y 3 recomendaciones temporales de Coru.

`src/lib/catalog.ts` se conserva únicamente como instantánea de la migración inicial y no puede importarse desde rutas o componentes. Cualquier cambio editorial posterior debe hacerse en Sanity Studio.

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
npm run test:affiliates
```

## Producción

- Repositorio: `CorukaiLab/Corukai`
- Vercel: `corukailab/corukai`
- Sanity Project ID: `eig4gq4g`
- Dataset: `production`
- Studio: `/studio`

El checkout devuelve un estado controlado mientras `STRIPE_SECRET_KEY` esté vacío. Antes de cobrar hay que completar Stripe, logística, condiciones de compra, privacidad y la revisión legal del precio fijo del libro.
