"use client";

import { useEffect, useRef, useState } from "react";
import type { CameraListener, Point, Size } from "./useCanvasPan";

/**
 * Returns only the items currently on screen. Items off screen are not
 * rendered, so they leave the DOM and come back when the camera returns.
 * The camera moves every frame, but React state only changes when an item
 * enters or leaves, so most frames cause no render.
 */
export function useVisibleItems<T extends Point>(
  items: T[],
  itemSize: Size,
  viewport: Size,
  subscribe: (listener: CameraListener) => () => void,
  readCamera: () => Point,
  margin = 0,
): T[] {
  const [visible, setVisible] = useState<T[]>([]);
  const current = useRef<T[]>([]);

  useEffect(() => {
    const measured = viewport.width > 0 && viewport.height > 0;
    const update = (camera: Point) => {
      const left = camera.x - viewport.width / 2 - margin;
      const right = camera.x + viewport.width / 2 + margin;
      const top = camera.y - viewport.height / 2 - margin;
      const bottom = camera.y + viewport.height / 2 + margin;
      const next = measured
        ? items.filter(
            (i) =>
              i.x + itemSize.width > left &&
              i.x < right &&
              i.y + itemSize.height > top &&
              i.y < bottom,
          )
        : [];
      const prev = current.current;
      if (next.length === prev.length && next.every((n, i) => n === prev[i])) {
        return;
      }
      current.current = next;
      setVisible(next);
    };
    update(readCamera());
    return subscribe(update);
  }, [items, itemSize.width, itemSize.height, viewport, subscribe, readCamera, margin]);

  return visible;
}
