import { defineField, defineType } from "sanity";

export const genre = defineType({
  name: "genre",
  title: "Genre",
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
      name: "color",
      title: "Color",
      type: "string",
      description: "Main genre color for product cards and filters.",
    }),
    defineField({
      name: "visualTone",
      title: "Visual tone",
      type: "text",
      rows: 3,
      description: "Mood notes for backgrounds, genre badges and art direction.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
  ],
});
