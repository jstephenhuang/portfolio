import type { Metadata } from "next";

import * as Gallery from "@/app/_components/PortfolioGallery";
import { getGalleryItems } from "@/lib/data/galleries";
import { isErr } from "@/lib/error";

export const metadata: Metadata = {
  title: "Work | jsh",
};

const WorkPage: React.FC = async () => {
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
