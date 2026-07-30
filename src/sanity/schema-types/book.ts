import { defineField, defineType } from "sanity";

export const book = defineType({
  name: "book",
  title: "Book",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "originalTitle",
      title: "Original title",
      type: "string",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publicationYear",
      title: "Publication year",
      type: "number",
    }),
    defineField({
      name: "genre",
      title: "Genre",
      type: "reference",
      to: [{ type: "genre" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "primaryEmotion",
      title: "Primary emotion",
      type: "reference",
      to: [{ type: "emotion" }],
    }),
    defineField({
      name: "emotions",
      title: "Emotions",
      type: "array",
      of: [{ type: "reference", to: [{ type: "emotion" }] }],
    }),
    defineField({
      name: "collections",
      title: "Collections",
      type: "array",
      of: [{ type: "reference", to: [{ type: "collection" }] }],
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "ambientImage",
      title: "Ambient image",
      type: "image",
      options: { hotspot: true },
      description:
        "Atmospheric image inspired by the book mood. Do not replace the real cover.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "vibe",
      title: "Vibe",
      type: "string",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "whyRead",
      title: "Why it may fit",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "idealMoment",
      title: "Ideal moment",
      type: "string",
    }),
    defineField({
      name: "forWhom",
      title: "For whom",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "notForWhom",
      title: "Maybe not for",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "curiosity",
      title: "Curiosity",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "music",
      title: "Associated music",
      type: "string",
    }),
    defineField({
      name: "relatedMovies",
      title: "Related movies or sensations",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "affiliateLink",
      title: "Affiliate link",
      type: "url",
    }),
    defineField({
      name: "priceCents",
      title: "Price in cents",
      type: "number",
      description: "Example: 1990 equals 19.90 EUR.",
      validation: (rule) => rule.integer().positive(),
    }),
    defineField({
      name: "format",
      title: "Format",
      type: "string",
      options: {
        list: ["Tapa blanda", "Tapa dura", "Bolsillo", "eBook", "Audiolibro"],
      },
    }),
    defineField({
      name: "stockStatus",
      title: "Stock status",
      type: "string",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Affiliate only", value: "affiliate" },
          { title: "Out of stock", value: "out-of-stock" },
          { title: "Draft", value: "draft" },
        ],
      },
      initialValue: "draft",
    }),
    defineField({
      name: "stripePriceId",
      title: "Stripe price ID",
      type: "string",
      description: "Optional. Keep secrets out of Sanity; only the public price ID belongs here.",
    }),
    defineField({
      name: "isFeatured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "string",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 3,
    }),
  ],
});
