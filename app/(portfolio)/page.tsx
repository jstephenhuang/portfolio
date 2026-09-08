import * as Gallery from "@/app/_components/PortfolioGallery";
import { getGalleryItems } from "@/lib/data/galleries";
import { isErr } from "@/lib/error";

const Root: React.FC = async () => {
  const itemsResult = await getGalleryItems("home");

  if (isErr(itemsResult)) throw itemsResult.error;

  return (
    <Gallery.Root items={itemsResult.data} storageKey="root-items">
      <Gallery.Description>
        <p>Studying Computer Engineer at University of Waterloo</p>
      </Gallery.Description>
    </Gallery.Root>
  );
};

export default Root;
