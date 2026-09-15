import { defineArrayMember, defineField, defineType } from "sanity";

export const article = defineType({
  name: "article",
  title: "Cuaderno editorial",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Título", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({ name: "excerpt", title: "Entradilla", type: "text", rows: 3, validation: (rule) => rule.required().max(240) }),
    defineField({
      name: "category",
      title: "Sección",
      type: "string",
      options: { list: ["Guía", "Carta", "Selección", "Ritual"] },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "publishedAt", title: "Fecha de publicación", type: "datetime", validation: (rule) => rule.required() }),
    defineField({
      name: "body",
      title: "Texto",
      type: "array",
      of: [defineArrayMember({ type: "block", styles: [{ title: "Normal", value: "normal" }, { title: "Subtítulo", value: "h2" }] })],
      validation: (rule) => rule.required().min(4),
    }),
    defineField({
      name: "relatedBooks",
      title: "Libros relacionados",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "book" }] })],
      validation: (rule) => rule.max(4),
    }),
    defineField({ name: "seoTitle", title: "Título SEO", type: "string", validation: (rule) => rule.max(60) }),
    defineField({ name: "seoDescription", title: "Descripción SEO", type: "text", rows: 3, validation: (rule) => rule.max(160) }),
  ],
});
