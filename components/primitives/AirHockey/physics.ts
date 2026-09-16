export type Vector = {
  x: number;
  y: number;
};

export type Bounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

export type CanvasView = { zoom: number; offset: Vector };
export type ItemRect = Vector & { width: number; height: number };

export const defaultView: CanvasView = { zoom: 1, offset: { x: 0, y: 0 } };

export const zoomAt = (view: CanvasView, zoom: number, point: Vector): CanvasView => ({
  zoom,
  offset: {
    x: point.x - ((point.x - view.offset.x) / view.zoom) * zoom,
    y: point.y - ((point.y - view.offset.y) / view.zoom) * zoom,
  },
});

export const fitView = (items: ItemRect[], width: number, height: number): CanvasView => {
  if (!items.length || width <= 0 || height <= 0) return defaultView;
  const left = Math.min(...items.map((item) => item.x));
  const top = Math.min(...items.map((item) => item.y));
  const right = Math.max(...items.map((item) => item.x + item.width));
  const bottom = Math.max(...items.map((item) => item.y + item.height));
  const padding = Math.min(80, width * 0.1, height * 0.15);
  const zoom = Math.min(
    2,
    (width - padding * 2) / Math.max(1, right - left),
    (height - padding * 2) / Math.max(1, bottom - top)
  );
  return {
    zoom,
    offset: { x: (width - (left + right) * zoom) / 2, y: (height - (top + bottom) * zoom) / 2 },
  };
};

export const getBounds = (rink: HTMLDivElement, item: HTMLDivElement, view = defaultView): Bounds => {
  const minX = -view.offset.x / view.zoom - item.offsetLeft;
  const minY = -view.offset.y / view.zoom - item.offsetTop;
  return {
    minX,
    minY,
    maxX: minX + Math.max(0, rink.clientWidth / view.zoom - item.offsetWidth),
    maxY: minY + Math.max(0, rink.clientHeight / view.zoom - item.offsetHeight),
  };
};

export const resolveCollision = (position: number, velocity: number, min: number, max: number, bounce: number) => {
  if (position < min) {
    return {
      position: min,
      velocity: Math.abs(velocity) * bounce,
    };
  }

  if (position > max) {
    return {
      position: max,
      velocity: -Math.abs(velocity) * bounce,
    };
  }

  return { position, velocity };
};
