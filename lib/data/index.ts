import aocMetadata from "@/db/dumps/aoc/metadata.json";
import craftingInterpretersMetadata from "@/db/dumps/crafting-interpreters/metadata.json";
import worldCup2026Metadata from "@/db/dumps/world-cup-2026/metadata.json";
import yapMetadata from "@/db/dumps/yap/metadata.json";

import { dumpMetadataSchema, type DumpMetadata, type Item } from "./schema";

export * from "./schema";

const metadataSources = [aocMetadata, worldCup2026Metadata, yapMetadata, craftingInterpretersMetadata];

export const dumpMetadata: DumpMetadata[] = metadataSources.map((metadata) => dumpMetadataSchema.parse(metadata));
export const rootItems: Item[] = dumpMetadata.map(({ body: _, ...item }) => item);

export const getDumpMetadata = (id: string): DumpMetadata | undefined =>
  dumpMetadata.find((metadata) => metadata.id === id);
