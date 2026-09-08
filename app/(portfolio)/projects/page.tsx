import type { Metadata } from "next";

import * as Gallery from "@/app/_components/PortfolioGallery";
import { getGalleryItems } from "@/lib/data/galleries";
import { isErr } from "@/lib/error";

export const metadata: Metadata = {
  title: "Projects | jsh",
};

const ProjectsPage: React.FC = async () => {
  const itemsResult = await getGalleryItems("projects");

  if (isErr(itemsResult)) throw itemsResult.error;

  return (
    <Gallery.Root items={itemsResult.data} storageKey="projects-items">
      <Gallery.Description>
        <p>
          <strong>cool</strong> things ive built
        </p>
      </Gallery.Description>
    </Gallery.Root>
  );
};

export default ProjectsPage;
