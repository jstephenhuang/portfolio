import type { Metadata } from "next";
import { notFound } from "next/navigation";

import * as Gallery from "@/app/_components/PortfolioGallery";
import { getGalleryItems } from "@/lib/data/galleries";
import { isErr } from "@/lib/error";
import { features } from "@/lib/features";

export const metadata: Metadata = {
  title: "Work | jsh",
};

const WorkPage: React.FC = async () => {
  if (!features.galleryPages) notFound();

  const itemsResult = await getGalleryItems("work");

  if (isErr(itemsResult)) throw itemsResult.error;

  return (
    <Gallery.Root items={itemsResult.data} storageKey="work-items">
      <Gallery.Description>
        <p>places ive worked</p>
      </Gallery.Description>
    </Gallery.Root>
  );
};

export default WorkPage;
