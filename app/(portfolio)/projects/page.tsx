import type { Metadata } from "next";
import { notFound } from "next/navigation";

import * as Gallery from "@/app/_components/PortfolioGallery";
import { getGalleryItems } from "@/lib/data/galleries";
import { isErr } from "@/lib/error";
import { features } from "@/lib/features";

export const metadata: Metadata = {
  title: "Projects | jsh",
};

const ProjectsPage: React.FC = async () => {
  if (!features.galleryPages) notFound();

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
