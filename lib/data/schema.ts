import { z } from "zod";

const dumpIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const markdownSourcePattern = /^[a-zA-Z0-9][a-zA-Z0-9/_-]*\.md$/;

export const dumpIdSchema = z.string().regex(dumpIdPattern);
export const galleryIdSchema = z.enum(["home", "work", "projects", "journal"]);

const isCalendarDate = (value: string): boolean => {
  const isoDate = value.replaceAll("/", "-");
  const parsedDate = new Date(`${isoDate}T00:00:00.000Z`);

  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === isoDate;
};

export const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const generalLinkSchema = z.object({
  label: z.string().optional(),
  href: z.url(),
});

export const itemLinksSchema = z.object({
  youtube: z.url().optional(),
  github: z.url().optional(),
  general: z.array(generalLinkSchema).optional(),
});

export const itemInteractionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("link"),
    href: z.string().min(1).optional(),
  }),
  z.object({
    type: z.literal("expandable"),
    defaultExpanded: z.boolean().optional(),
  }),
]);

export const itemSchema = z.object({
  id: dumpIdSchema,
  title: z.string().min(1),
  description: z.string(),
  thumbnail: z.string().min(1),
  firstImage: z.string().min(1),
  hideThumbnailTitle: z.boolean().optional(),
  width: z.number().positive(),
  defaultPosition: positionSchema,
  links: itemLinksSchema,
  interaction: itemInteractionSchema.default({ type: "link" }),
});

export const markdownBlockSchema = z.object({
  type: z.literal("markdown"),
  src: z.string().regex(markdownSourcePattern),
  compact: z.boolean().optional(),
});

export const imageBlockSchema = z.object({
  type: z.literal("image"),
  src: z.string().min(1),
  alt: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  fullWidth: z.boolean().optional(),
  caption: z.string().optional(),
});

export const videoBlockSchema = z.object({
  type: z.literal("video"),
  src: z.string().min(1),
  title: z.string().optional(),
  poster: z.string().min(1).optional(),
  caption: z.string().optional(),
});

export const dumpContentBlockSchema = z.discriminatedUnion("type", [
  markdownBlockSchema,
  imageBlockSchema,
  videoBlockSchema,
]);

export const dumpDateSchema = z
  .string()
  .regex(/^\d{4}\/\d{2}\/\d{2}$/)
  .refine(isCalendarDate, {
    message: "Date must be a real calendar date in YYYY/MM/DD format.",
  });

export const dumpMetadataSchema = itemSchema.extend({
  galleries: z
    .array(galleryIdSchema)
    .min(1)
    .refine((galleries) => new Set(galleries).size === galleries.length, {
      message: "Gallery IDs must be unique.",
    }),
  body: z.record(dumpDateSchema, z.array(dumpContentBlockSchema).min(1)),
});

export type Position = z.infer<typeof positionSchema>;
export type ItemInteraction = z.infer<typeof itemInteractionSchema>;
export type Item = z.infer<typeof itemSchema>;
export type GalleryId = z.infer<typeof galleryIdSchema>;
export type DumpContentBlock = z.infer<typeof dumpContentBlockSchema>;
export type DumpMetadata = z.infer<typeof dumpMetadataSchema>;
