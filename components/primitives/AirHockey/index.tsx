"use client";

import { MotionConfig, motion, type PanInfo, useAnimationFrame, useDragControls, useMotionValue } from "motion/react";
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { Provider, type ProviderProps, useAirHockeyContext } from "./Context";
import {
  type Bounds, defaultView, fitView, getBounds, type ItemRect, resolveCollision, type Vector, zoomAt,
} from "./physics";

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

interface RootProps extends React.ComponentProps<"div">, Pick<ProviderProps, "physics" | "off"> {
  canvas?: boolean;
  controls?: React.ReactNode;
}

const Root: React.FC<RootProps> = ({ children, physics, off, canvas = false, controls, style, ...props }) => {
  const rinkRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef(new Map<HTMLDivElement, () => ItemRect>());
  const [view, setView] = useState(defaultView);
  const register = useCallback((element: HTMLDivElement, measure: () => ItemRect) => {
    itemsRef.current.set(element, measure);
    return () => {
      itemsRef.current.delete(element);
    };
  }, []);
  const setZoom = useCallback((zoom: number) => {
    const rink = rinkRef.current;
    if (!rink || !canvas) return;
    setView((current) => zoomAt(current, Math.min(2, Math.max(0.1, zoom)), {
      x: rink.clientWidth / 2, y: rink.clientHeight / 2,
    }));
  }, [canvas]);
  const fitAll = useCallback(() => {
    const rink = rinkRef.current;
    if (!rink || !canvas) return;
    setView(fitView([...itemsRef.current.values()].map((measure) => measure()), rink.clientWidth, rink.clientHeight));
  }, [canvas]);
  const transformPagePoint = useCallback((point: Vector) => ({
    x: point.x / view.zoom, y: point.y / view.zoom,
  }), [view.zoom]);

  useEffect(() => {
    const rink = rinkRef.current;
    if (!rink || !canvas) return;
    let pinch: { distance: number; center: Vector } | null = null;
    const readPinch = (event: TouchEvent) => {
      const [first, second] = event.touches;
      const rect = rink.getBoundingClientRect();
      return {
        distance: Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY),
        center: {
          x: (first.clientX + second.clientX) / 2 - rect.left,
          y: (first.clientY + second.clientY) / 2 - rect.top,
        },
      };
    };
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 2) return;
      event.preventDefault();
      pinch = readPinch(event);
      setView((current) => ({ ...current }));
    };
    const handleTouchMove = (event: TouchEvent) => {
      if (!pinch || event.touches.length !== 2) return;
      event.preventDefault();
      const previous = pinch;
      const next = readPinch(event);
      pinch = next;
      setView((current) => {
        const zoom = Math.min(2, Math.max(0.1, current.zoom * next.distance / Math.max(1, previous.distance)));
        const nextView = zoomAt(current, zoom, previous.center);
        return {
          zoom,
          offset: {
            x: nextView.offset.x + next.center.x - previous.center.x,
            y: nextView.offset.y + next.center.y - previous.center.y,
          },
        };
      });
    };
    const handleTouchEnd = () => {
      pinch = null;
    };
    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const rect = rink.getBoundingClientRect();
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rink.clientHeight : 1);
      setView((current) => zoomAt(current, Math.min(2, Math.max(0.1, current.zoom * Math.exp(-delta * 0.01))), {
        x: event.clientX - rect.left, y: event.clientY - rect.top,
      }));
    };
    rink.addEventListener("wheel", handleWheel, { passive: false });
    rink.addEventListener("touchstart", handleTouchStart, { passive: false });
    rink.addEventListener("touchmove", handleTouchMove, { passive: false });
    rink.addEventListener("touchend", handleTouchEnd);
    rink.addEventListener("touchcancel", handleTouchEnd);
    return () => {
      rink.removeEventListener("wheel", handleWheel);
      rink.removeEventListener("touchstart", handleTouchStart);
      rink.removeEventListener("touchmove", handleTouchMove);
      rink.removeEventListener("touchend", handleTouchEnd);
      rink.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [canvas]);

  return (
    <Provider
      physics={physics} off={off} rinkRef={rinkRef} view={view}
      register={register} setZoom={setZoom} fitAll={fitAll}
    >
      <div
        ref={rinkRef}
        style={{
          position: "relative", isolation: "isolate", overflow: "hidden", ...style,
          ...(canvas ? {
            "--canvas-width": `${100 / view.zoom}dvw`,
            "--canvas-height": `${100 / view.zoom}dvh`,
            backgroundSize: `${24 * view.zoom}px ${24 * view.zoom}px`,
            backgroundPosition: `${view.offset.x}px ${view.offset.y}px` } : {}),
        } as React.CSSProperties}
        {...props}
      >
        <MotionConfig transformPagePoint={transformPagePoint}>
          {canvas ? (
            <div style={{
              position: "absolute", inset: 0, transformOrigin: "0 0",
              transform: `translate(${view.offset.x}px, ${view.offset.y}px) scale(${view.zoom})`,
            }}>
              {children}
            </div>
          ) : children}
        </MotionConfig>
      </div>
      {controls}
    </Provider>
  );
};

const ZoomControls: React.FC<React.ComponentProps<"div">> = (props) => {
  const { view, setZoom, fitAll } = useAirHockeyContext();
  return (
    <div role="group" aria-label="Canvas zoom" {...props}>
      <button type="button" aria-label="Zoom out" disabled={view.zoom <= 0.1} onClick={() => setZoom(view.zoom / 1.2)}>
        −
      </button>
      <button
        type="button"
        aria-label={`Zoom ${Math.round(view.zoom * 100)} percent. Reset to 100 percent`}
        title="Reset zoom to 100%"
        onClick={() => setZoom(1)}
      >
        {Math.round(view.zoom * 100)}%
      </button>
      <button type="button" aria-label="Zoom in" disabled={view.zoom >= 2} onClick={() => setZoom(view.zoom * 1.2)}>
        +
      </button>
      <button type="button" onClick={fitAll}>Fit all</button>
    </div>
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
  const { physics, off, rinkRef, view, register } = useAirHockeyContext();
  const dragControls = useDragControls();
  const itemRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<Bounds | null>(null);
  const velocityRef = useRef<Vector>({ x: 0, y: 0 });
  const gestureRef = useRef({ didDrag: false, pointerId: null as number | null });
  const isDraggingRef = useRef(false);
  const isMovingRef = useRef(false);
  const hasInitializedRef = useRef(false);
  const [isPositioned, setIsPositioned] = useState(false);
  const [dragBounds, setDragBounds] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
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

    boundsRef.current = getBounds(rink, item, view);
    const bounds = boundsRef.current;
    setDragBounds({ left: bounds.minX, right: bounds.maxX, top: bounds.minY, bottom: bounds.maxY });

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
  }, [initialX, initialY, rinkRef, view, x, y]);

  useLayoutEffect(() => {
    const item = itemRef.current;
    if (!item) return;
    return register(item, () => ({
      x: x.get() + item.offsetLeft,
      y: y.get() + item.offsetTop,
      width: item.offsetWidth,
      height: item.offsetHeight,
    }));
  }, [register, x, y]);

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
    if (off) {
      dragControls.cancel();
      isDraggingRef.current = false;
      settle();
    }
  }, [dragControls, off, settle]);

  useLayoutEffect(() => {
    // A camera change invalidates an active gesture's coordinate system.
    dragControls.cancel();
    if (gestureRef.current.pointerId !== null) gestureRef.current.didDrag = true;
    isDraggingRef.current = false;
    x.stop();
    y.stop();
    isMovingRef.current = false;
    velocityRef.current = { x: 0, y: 0 };
  }, [dragControls, view, x, y]);

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
    x.stop();
    y.stop();
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

    isMovingRef.current = false;
    velocityRef.current = { x: 0, y: 0 };
    dragControls.start(event, {
      distanceThreshold: getDragActivationThreshold(dragActivationThreshold, event.pointerType) / view.zoom,
    });
  };

  const handlePointerCancelCapture = (event: React.PointerEvent<HTMLDivElement>): void => {
    onPointerCancelCapture?.(event);

    if (gestureRef.current.pointerId === event.pointerId) {
      dragControls.cancel();
      isDraggingRef.current = false;
      settle();
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
      dragConstraints={dragBounds}
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

export { Root, Item, ZoomControls };
