import cx from "classnames";

import { Image } from "@/components/ui";
import { type DumpContentBlock } from "@/lib/data";

import BlockWrapper from "./BlockWrapper";
import { getBlockLabel } from "./getBlockLabel";
import styles from "./styles.module.scss";

type ImageContentBlock = Extract<DumpContentBlock, { type: "image" }>;

interface ImageBlockProps {
  block: ImageContentBlock;
  id: string;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ block, id }) => {
  return (
    <BlockWrapper id={id} label={getBlockLabel(block.src)}>
      <figure className={styles.media}>
        <Image
          className={cx(styles.mediaImage, block.fullWidth && styles.mediaImageFullWidth)}
          src={block.src}
          alt={block.alt || "empty image"}
          width={block.width}
          height={block.height}
          unoptimized
        />
        {block.caption && <figcaption className={styles.mediaCaption}>{block.caption}</figcaption>}
      </figure>
    </BlockWrapper>
  );
};

export default ImageBlock;
