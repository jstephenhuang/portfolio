import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { cache } from "react";
import { z } from "zod";

import { dumpIdSchema, dumpMetadataSchema, type DumpContentBlock, type DumpMetadata } from "@/lib/data";
import { err, isErr, ok, type Result, tryCatch } from "@/lib/error";

const dumpsDirectory = path.join(process.cwd(), "db", "dumps");

type MarkdownBlock = Extract<DumpContentBlock, { type: "markdown" }>;

export type LoadedDumpContentBlock = (MarkdownBlock & { body: string }) | Exclude<DumpContentBlock, MarkdownBlock>;

export interface DumpLog {
  blocks: LoadedDumpContentBlock[];
  date: string;
}

const readDumpMetadata = async (directory: string): Promise<DumpMetadata> => {
  const metadataPath = path.join(dumpsDirectory, directory, "metadata.json");
  const contents = await readFile(metadataPath, "utf8");
  let source: unknown;

  try {
    source = JSON.parse(contents);
  } catch (error) {
    throw new Error(`${directory}/metadata.json contains invalid JSON.`, { cause: error });
  }

  const parsed = dumpMetadataSchema.safeParse(source);

  if (!parsed.success) {
    throw new Error(`${directory}/metadata.json\n${z.prettifyError(parsed.error)}`);
  }

  if (parsed.data.id !== directory) {
    throw new Error(`${directory}/metadata.json must use \"${directory}\" as its id.`);
  }

  return parsed.data;
};

const readAllDumpMetadata = async (): Promise<DumpMetadata[]> => {
  const entries = await readdir(dumpsDirectory, { withFileTypes: true });
  const directories = entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => entry.name)
    .sort();

  return Promise.all(directories.map(readDumpMetadata));
};

export const getAllDumpMetadata = cache(async (): Promise<Result<DumpMetadata[]>> =>
  tryCatch(readAllDumpMetadata())
);

export const getDumpMetadata = cache(async (id: string): Promise<Result<DumpMetadata | undefined>> => {
  if (!dumpIdSchema.safeParse(id).success) return ok(undefined);

  const metadataResult = await getAllDumpMetadata();

  if (isErr(metadataResult)) return err(metadataResult.error, false);

  return ok(metadataResult.data.find((metadata) => metadata.id === id));
});

export const getDumpLogs = cache(async (metadata: DumpMetadata): Promise<Result<DumpLog[]>> => {
  if (!dumpIdSchema.safeParse(metadata.id).success) return err(new Error("Invalid dump id."), false);

  const logsResult = await tryCatch(
    Promise.all(
      Object.entries(metadata.body)
        .sort(([firstDate], [secondDate]) => secondDate.localeCompare(firstDate))
        .map(
          async ([date, blocks]): Promise<DumpLog> => ({
            date,
            blocks: await Promise.all(
              blocks.map(async (block): Promise<LoadedDumpContentBlock> => {
                if (block.type !== "markdown") return block;

                return {
                  ...block,
                  body: await readFile(path.join(dumpsDirectory, metadata.id, block.src), "utf8"),
                };
              })
            ),
          })
        )
    )
  );

  if (isErr(logsResult)) return logsResult;

  return logsResult;
});
