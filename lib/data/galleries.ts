import { rootItems } from ".";

export const galleryItemIds = {
  home: ["world-cup-2026", "yap", "crafting-interpreters"],
  work: [],
  projects: [],
  journal: ["aoc"],
} as const;

export type GalleryId = keyof typeof galleryItemIds;

export const getGalleryItems = (galleryId: GalleryId) => {
  const itemIds: readonly string[] = galleryItemIds[galleryId];
  const duplicateItemIds = itemIds.filter((itemId, index) => itemIds.indexOf(itemId) !== index);

  if (duplicateItemIds.length > 0) {
    throw new Error(`Duplicate item IDs in ${galleryId}: ${duplicateItemIds.join(", ")}`);
  }

  return itemIds.map((itemId) => {
    const item = rootItems.find((candidate) => candidate.id === itemId);

    if (!item) throw new Error(`Unknown item ID in ${galleryId}: ${itemId}`);

    return item;
  });
};
