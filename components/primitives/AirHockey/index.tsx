"use client";

import { motion, type PanInfo, useAnimationFrame, useDragControls, useMotionValue } from "motion/react";
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { Provider, type ProviderProps, useAirHockeyContext } from "./Context";
import { type Bounds, getBounds, resolveCollision, type Vector } from "./physics";

type PointerType = "mouse" | "pen" | "touch";

export type DragActivationThreshold = number | Partial<Record<PointerType, number>>;

const defaultDragActivationThreshold: Record<PointerType, number> = {
  mouse: 6,
  pen: 6,
  touch: 10,
};

const getDragActivationThreshold = (threshold: DragActivationThreshold, pointerType: string): number => {
  if (typeof threshold === "number") return Math.max(0, threshold);

  const resolvedPointerType = pointerType === "pen" || pointerType === "touch" ? pointerType : "mouse";

  return Math.max(0, threshold[resolvedPointerType] ?? defaultDragActivationThreshold[resolvedPointerType]);
};

interface RootProps extends React.ComponentProps<"div">, Omit<ProviderProps, "rinkRef"> {}

const Root: React.FC<RootProps> = ({ children, physics, off, style, ...props }) => {
  const rinkRef = useRef<HTMLDivElement>(null);

  return (
    <Provider physics={physics} off={off} rinkRef={rinkRef}>
      <div
        ref={rinkRef}
        style={{ position: "relative", isolation: "isolate", overflow: "hidden", ...style }}
        {...props}
      >
        {children}
      </div>
    </Provider>
  );
};

interface ItemProps extends React.ComponentProps<typeof motion.div> {
  dragActivationThreshold?: DragActivationThreshold;
  initialX?: number;
  initialY?: number;
  onSettle?: (position: Vector) => void;
}

const Item: React.FC<ItemProps> = ({
  children,
  dragActivationThreshold = defaultDragActivationThreshold,
  initialX = 0,
  initialY = 0,
  style,
  onClickCapture,
  onDragStart,
  onDragEnd,
  onPointerCancelCapture,
  onPointerDownCapture,
  onSettle,
  ...props
}) => {
  const { physics, off, rinkRef } = useAirHockeyContext();
  const dragControls = useDragControls();
  const itemRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<Bounds | null>(null);
  const velocityRef = useRef<Vector>({ x: 0, y: 0 });
  const gestureRef = useRef({ didDrag: false, pointerId: null as number | null });
  const isDraggingRef = useRef(false);
  const isMovingRef = useRef(false);
  const hasInitializedRef = useRef(false);
  const [isPositioned, setIsPositioned] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const settle = useCallback(() => {
    const bounds = boundsRef.current;

    isMovingRef.current = false;
    velocityRef.current = { x: 0, y: 0 };

    if (!bounds) return;

    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;

    onSettle?.({
      x: width === 0 ? 0 : (x.get() - bounds.minX) / width,
      y: height === 0 ? 0 : (y.get() - bounds.minY) / height,
    });
  }, [onSettle, x, y]);

  const measureBounds = useCallback(() => {
    const rink = rinkRef.current;
    const item = itemRef.current;

    if (!rink || !item) return;

    boundsRef.current = getBounds(rink, item);
    const bounds = boundsRef.current;

    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      const normalizedX = Math.min(1, Math.max(0, initialX));
      const normalizedY = Math.min(1, Math.max(0, initialY));

      x.set(bounds.minX + normalizedX * (bounds.maxX - bounds.minX));
      y.set(bounds.minY + normalizedY * (bounds.maxY - bounds.minY));
      setIsPositioned(true);
      return;
    }

    x.set(Math.min(bounds.maxX, Math.max(bounds.minX, x.get())));
    y.set(Math.min(bounds.maxY, Math.max(bounds.minY, y.get())));
  }, [initialX, initialY, rinkRef, x, y]);

  useLayoutEffect(() => {
    const rink = rinkRef.current;
    const item = itemRef.current;

    if (!rink || !item) return;

    measureBounds();

    const observer = new ResizeObserver(measureBounds);

    observer.observe(rink);
    observer.observe(item);

    return () => {
      observer.disconnect();
    };
  }, [measureBounds, rinkRef]);

  useEffect(() => {
    if (off) settle();
  }, [off, settle]);

  useAnimationFrame((_, delta) => {
    const bounds = boundsRef.current;

    if (!bounds) {
      measureBounds();
      return;
    }

    if (off || isDraggingRef.current || !isMovingRef.current) return;

    const friction = Math.min(1, Math.max(0, physics.friction));
    const bounce = Math.min(1, Math.max(0, physics.bounce));
    const elapsed = Math.min(delta, 32) / 1000;
    const decay = Math.exp(-friction * 8 * elapsed);
    const nextVelocityX = velocityRef.current.x * decay;
    const nextVelocityY = velocityRef.current.y * decay;

    const collisionX = resolveCollision(
      x.get() + nextVelocityX * elapsed,
      nextVelocityX,
      bounds.minX,
      bounds.maxX,
      bounce
    );
    const collisionY = resolveCollision(
      y.get() + nextVelocityY * elapsed,
      nextVelocityY,
      bounds.minY,
      bounds.maxY,
      bounce
    );

    velocityRef.current = {
      x: collisionX.velocity,
      y: collisionY.velocity,
    };
    x.set(collisionX.position);
    y.set(collisionY.position);

    if (Math.hypot(collisionX.velocity, collisionY.velocity) < 8) {
      settle();
    }
  });

  const handleDragStart = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    gestureRef.current.didDrag = true;
    isDraggingRef.current = true;
    isMovingRef.current = false;
    velocityRef.current = { x: 0, y: 0 };
    onDragStart?.(event, info);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    isDraggingRef.current = false;
    velocityRef.current = {
      x: info.velocity.x,
      y: info.velocity.y,
    };
    isMovingRef.current = Math.hypot(velocityRef.current.x, velocityRef.current.y) >= 8;

    if (!isMovingRef.current) settle();
    onDragEnd?.(event, info);
  };

  const handlePointerDownCapture = (event: React.PointerEvent<HTMLDivElement>): void => {
    onPointerDownCapture?.(event);

    if (!event.isPrimary || event.button !== 0) return;

    gestureRef.current = {
      didDrag: false,
      pointerId: event.pointerId,
    };

    if (event.defaultPrevented || off) return;

    const target = event.target;

    if (target instanceof Element && target.closest("[data-air-hockey-no-drag]")) return;

    dragControls.start(event, {
      distanceThreshold: getDragActivationThreshold(dragActivationThreshold, event.pointerType),
    });
  };

  const handlePointerCancelCapture = (event: React.PointerEvent<HTMLDivElement>): void => {
    onPointerCancelCapture?.(event);

    if (gestureRef.current.pointerId === event.pointerId) {
      gestureRef.current = { didDrag: false, pointerId: null };
    }
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>): void => {
    const clickPointerId = (event.nativeEvent as MouseEvent & { pointerId?: number }).pointerId;
    const isMatchingPointer = clickPointerId === undefined || clickPointerId === gestureRef.current.pointerId;
    const shouldSuppressClick = event.detail > 0 && gestureRef.current.didDrag && isMatchingPointer;

    gestureRef.current = { didDrag: false, pointerId: null };

    if (shouldSuppressClick) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClickCapture?.(event);
  };

  return (
    <motion.div
      {...props}
      ref={itemRef}
      drag={!off}
      dragControls={dragControls}
      dragConstraints={rinkRef}
      dragElastic={0}
      dragListener={false}
      dragMomentum={false}
      onClickCapture={handleClickCapture}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onPointerCancelCapture={handlePointerCancelCapture}
      onPointerDownCapture={handlePointerDownCapture}
      style={{ position: "absolute", ...style, visibility: isPositioned ? undefined : "hidden", x, y }}
    >
      {children}
    </motion.div>
  );
};

export { Root, Item };
