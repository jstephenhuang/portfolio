"use client";

import cx from "classnames";
import type React from "react";

import * as AirHockey from "@/components/primitives/AirHockey";
import type { Item } from "@/lib/data";
import { useArrangedItems } from "@/lib/hooks";

import { useSettings } from "../contexts/SettingsContext";
import GalleryItem from "../GalleryItem";
import styles from "./styles.module.scss";

interface PortfolioGalleryProps {
  items: Item[];
  storageKey: string;
  canvas?: boolean;
}

const Description: React.FC<React.ComponentPropsWithRef<"div">> = ({ children, className, ...props }) => (
  <div className={cx(styles.description, className)} {...props}>
    {children}
  </div>
);

const Root: React.FC<React.PropsWithChildren<PortfolioGalleryProps>> = ({ children, items, storageKey, canvas = false }) => {
  const { bounce, friction, layout } = useSettings();
  const { arrangedItems, isLoading, savePosition, bringForward } = useArrangedItems(items, storageKey);
  const isLocked = layout === "lock";

  return (
    <main className={cx(styles.page, canvas && styles.canvas)}>
      {children}
      <AirHockey.Root
        className={`${styles.board} ${isLocked ? styles.fixed : ""}`}
        physics={{ bounce, friction }}
        off={isLocked}
        canvas={canvas}
        controls={canvas ? <AirHockey.ZoomControls className={styles.zoomControls} /> : undefined}
      >
        {!isLoading &&
          arrangedItems.map((item) => (
            <AirHockey.Item
              key={item.id}
              className={styles.item}
              initialX={item.position.x}
              initialY={item.position.y}
              whileDrag={{ cursor: "grabbing" }}
              style={
                {
                  zIndex: item.zIndex,
                  "--item-width": `${item.thumbWidth}px`,
                  "--first-image-width": item.firstImageWidth ? `${item.firstImageWidth}px` : "100%",
                } as React.CSSProperties
              }
              onPointerDown={() => {
                bringForward(item.id);
              }}
              onSettle={({ x, y }) => savePosition(item.id, x, y)}
            >
              <GalleryItem item={item} />
            </AirHockey.Item>
          ))}
      </AirHockey.Root>
    </main>
  );
};

export { Root, Description };
