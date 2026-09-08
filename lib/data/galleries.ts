import "server-only";

import { cache } from "react";

import { err, isErr, ok, type Result } from "@/lib/error";

import { getAllDumpMetadata } from "./dumps";
import { type DumpMetadata, type GalleryId, type Item } from "./schema";

const toItem = ({ body: _body, galleries: _galleries, ...item }: DumpMetadata): Item => item;

export const getGalleryItems = cache(async (galleryId: GalleryId): Promise<Result<Item[]>> => {
  const metadataResult = await getAllDumpMetadata();

  if (isErr(metadataResult)) return err(metadataResult.error, false);

  const items = metadataResult.data
    .filter((metadata) => metadata.galleries.includes(galleryId))
    .sort((first, second) => first.id.localeCompare(second.id))
    .map(toItem);

  return ok(items);
});

export type { GalleryId } from "./schema";
