"use client";

import { useLocalStorage } from "@mantine/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";

import { type Item, type Position } from "../data";

type Arrangement = {
  position: Position;
  zIndex: number;
};

export type ArrangedItem = Item & Arrangement;

type StoredArrangements = Record<string, Arrangement>;

const arrangeItems = (rawItems: Item[], storedArrangements: StoredArrangements): ArrangedItem[] => {
  return rawItems.map((item, index) => ({
    ...item,
    position: storedArrangements[item.id]?.position ?? item.defaultPosition,
    zIndex: storedArrangements[item.id]?.zIndex ?? index + 1,
  }));
};

const getArrangement = (rawItems: Item[], storedArrangements: StoredArrangements, id: string) => {
  const index = rawItems.findIndex((item) => item.id === id);

  if (index === -1) return;

  return (
    storedArrangements[id] ?? {
      position: rawItems[index].defaultPosition,
      zIndex: index + 1,
    }
  );
};

const normalizeZIndexes = (rawItems: Item[], storedArrangements: StoredArrangements): StoredArrangements => {
  return Object.fromEntries(
    arrangeItems(rawItems, storedArrangements)
      .sort((first, second) => first.zIndex - second.zIndex)
      .map((item, index) => [
        item.id,
        {
          position: item.position,
          zIndex: index + 1,
        },
      ])
  );
};

export const useArrangedItems = (rawItems: Item[], key: string) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [storedArrangements, setStoredArrangements, resetStoredArrangements] = useLocalStorage<StoredArrangements>({
    key,
    defaultValue: {},
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsHydrated(true));

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const arrangedItems = useMemo(() => arrangeItems(rawItems, storedArrangements), [rawItems, storedArrangements]);

  const savePosition = useCallback(
    (id: string, x: number, y: number) => {
      setStoredArrangements((current) => {
        const arrangement = getArrangement(rawItems, current, id);

        if (!arrangement) return current;
        if (arrangement.position.x === x && arrangement.position.y === y) return current;

        return {
          ...current,
          [id]: {
            ...arrangement,
            position: { x, y },
          },
        };
      });
    },
    [rawItems, setStoredArrangements]
  );

  const bringForward = useCallback(
    (id: string) => {
      setStoredArrangements((current) => {
        const arrangement = getArrangement(rawItems, current, id);

        if (!arrangement) return current;

        const zIndex = Math.max(0, ...arrangeItems(rawItems, current).map((item) => item.zIndex)) + 1;
        const nextArrangements = {
          ...current,
          [id]: {
            ...arrangement,
            zIndex,
          },
        };

        return zIndex >= 200 ? normalizeZIndexes(rawItems, nextArrangements) : nextArrangements;
      });
    },
    [rawItems, setStoredArrangements]
  );

  const reset = useCallback(() => {
    resetStoredArrangements();
  }, [resetStoredArrangements]);

  return {
    arrangedItems,
    isLoading: !isHydrated,
    reset,
    savePosition,
    bringForward,
  };
};
