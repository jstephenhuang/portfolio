import type { Metadata } from "next";

import * as Gallery from "@/app/_components/PortfolioGallery";
import { getGalleryItems } from "@/lib/data/galleries";
import { isErr } from "@/lib/error";

export const metadata: Metadata = {
  title: "Experience | jsh",
};

const ExperiencePage: React.FC = async () => {
  const itemsResult = await getGalleryItems("experience");

  if (isErr(itemsResult)) throw itemsResult.error;

  return (
    <Gallery.Root items={itemsResult.data} storageKey="experience-items">
      {/* <Gallery.Description>
        <p>places ive worked</p>
      </Gallery.Description> */}
    </Gallery.Root>
  );
};

export default ExperiencePage;
