import type { Metadata } from "next";

import * as Gallery from "@/app/_components/PortfolioGallery";
import { getGalleryItems } from "@/lib/data/galleries";
import { isErr } from "@/lib/error";

export const metadata: Metadata = {
  title: "Journal | jsh",
};

const JournalPage: React.FC = async () => {
  const itemsResult = await getGalleryItems("journal");

  if (isErr(itemsResult)) throw itemsResult.error;

  return (
    <Gallery.Root items={itemsResult.data} storageKey="journal-items">
      <Gallery.Description>
        <p>
          <strong>random</strong> thoughts into <strong>random</strong> topics
        </p>
      </Gallery.Description>
    </Gallery.Root>
  );
};

export default JournalPage;
