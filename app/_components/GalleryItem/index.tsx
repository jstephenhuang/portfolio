"use client";

import { MinusIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useId, useState } from "react";

import { Image } from "@/components/ui/Image";
import type { Item } from "@/lib/data";

import styles from "./styles.module.scss";

interface GalleryItemProps {
  item: Item;
}

type ExpandableItem = Item & {
  interaction: Extract<Item["interaction"], { type: "expandable" }>;
};

const isExpandableItem = (item: Item): item is ExpandableItem => item.interaction.type === "expandable";

const ThumbnailCard: React.FC<GalleryItemProps> = ({ item }) => (
  <div className={styles.thumbnailCard}>
    <div className={styles.thumbnailWrapper}>
      <Image
        className={styles.thumbnail}
        src={item.thumbnail}
        alt={item.title}
        draggable={false}
        loading="eager"
      />
    </div>
    {!item.hideThumbnailTitle && <div className={styles.thumbnailTitle}>{item.title}</div>}
  </div>
);

const LinkedCard: React.FC<GalleryItemProps> = ({ item }) => (
  <Link className={styles.linkCard} href={`/dumps/${item.id}`} draggable={false}>
    <ThumbnailCard item={item} />
  </Link>
);

const ExpandedCard: React.FC<{ item: ExpandableItem }> = ({ item }) => {
  const detailsId = useId();
  const [isExpanded, setIsExpanded] = useState(item.interaction.defaultExpanded ?? false);

  return (
    <div className={styles.expandableCard} data-expanded={isExpanded}>
      <button
        className={styles.expandCard}
        type="button"
        aria-expanded={isExpanded}
        aria-controls={detailsId}
        hidden={isExpanded}
        onClick={() => setIsExpanded(true)}
      >
        <ThumbnailCard item={item} />
      </button>
      <div className={styles.expandedCard} id={detailsId} hidden={!isExpanded}>
        <div className={styles.firstImageWrapper}>
          <Image
            className={styles.firstImage}
            src={item.firstImage}
            alt={item.title}
            draggable={false}
            loading="eager"
          />
          <button
            className={styles.minimizeButton}
            type="button"
            aria-label={`Minimize ${item.title}`}
            aria-expanded={isExpanded}
            aria-controls={detailsId}
            data-air-hockey-no-drag
            onClick={() => setIsExpanded(false)}
          >
            <MinusIcon aria-hidden="true" />
          </button>
        </div>
        <div className={styles.details}>
          <div className={styles.expandedTitle}>{item.title}</div>
          <p className={styles.description}>{item.description}</p>
        </div>
      </div>
    </div>
  );
};

const GalleryItem: React.FC<GalleryItemProps> = ({ item }) => {
  if (isExpandableItem(item)) return <ExpandedCard item={item} />;

  return <LinkedCard item={item} />;
};

export default GalleryItem;
