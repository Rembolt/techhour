"use client";

import { memo, useLayoutEffect, useMemo, useRef } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import ProjectCard from "@/components/projects/ProjectCard";
import { Project } from "@/types/project";
import { useCanvasPan, type Point } from "./hooks/useCanvasPan";
import { useVisibleItems } from "./hooks/useVisibleItems";
import {
  buildLayout,
  CARD_HEIGHT,
  CARD_WIDTH,
  VIEW_INSETS,
  type PlacedProject,
} from "./layout";

const CARD_SIZE = { width: CARD_WIDTH, height: CARD_HEIGHT };
/** Cards mount this far (px) before entering the screen, while still faded out. */
const MOUNT_MARGIN = 400;

/**
 * Fades the screen edges to black. It is one static overlay instead of an
 * opacity per card, so panning needs no per-frame fade work. The ramp is a
 * smootherstep: clear in the middle half, black at the very edge.
 */
const RAMP =
  "#000, rgb(0 0 0/.9) 6%, rgb(0 0 0/.5) 12.5%, rgb(0 0 0/.1) 19%, transparent 25% 75%, rgb(0 0 0/.1) 81%, rgb(0 0 0/.5) 87.5%, rgb(0 0 0/.9) 94%, #000";
const VIGNETTE = `linear-gradient(to right, ${RAMP}), linear-gradient(to bottom, ${RAMP})`;
/** Hover effects stay off until panning has been idle this long (ms). */
const PAN_IDLE_MS = 120;

function EdgeNotice({ className }: { className: string }) {
  return (
    <p
      className={`pointer-events-none absolute z-10 text-sm text-white/50 ${className}`}
    >
      No more projects this way
    </p>
  );
}

/** Faint chevron plus a short label hinting that the canvas pans this way. */
function DirectionHint({
  icon: Icon,
  label,
  vertical,
  labelFirst,
  className,
}: {
  icon: LucideIcon;
  label: string;
  /** Rotate the label so it stays narrow along the left and right edges. */
  vertical?: boolean;
  labelFirst?: boolean;
  className: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute z-10 flex items-center gap-2 text-white/60 ${
        labelFirst ? "flex-col-reverse" : "flex-col"
      } ${className}`}
    >
      <Icon strokeWidth={1.5} className="size-9 animate-pulse" />
      <span
        className={`text-[11px] uppercase tracking-[0.2em] text-white/40 ${
          vertical ? "[writing-mode:vertical-rl]" : ""
        }`}
      >
        {label}
      </span>
    </div>
  );
}

const CanvasCard = memo(function CanvasCard({ item }: { item: PlacedProject }) {
  return (
    <div
      className="absolute"
      style={{ left: item.x, top: item.y, width: CARD_WIDTH }}
    >
      <ProjectCard project={item.project} />
    </div>
  );
});

/**
 * This is a draggable canvas of project cards. Only cards near the screen
 * are mounted (useVisibleItems). They sit in one "world" layer, and panning
 * only moves that layer (useCanvasPan), so React never re-renders on a pan.
 */
export default function ExploreCanvas({ projects }: { projects: Project[] }) {
  const layout = useMemo(() => buildLayout(projects), [projects]);
  const { viewportRef, size, dragging, handlers, edges, subscribe, readCamera } =
    useCanvasPan(layout, VIEW_INSETS);
  const visible = useVisibleItems(
    layout.items,
    CARD_SIZE,
    size,
    subscribe,
    readCamera,
    MOUNT_MARGIN,
  );
  const worldRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = worldRef.current;
    if (!el) return;
    const dpr = window.devicePixelRatio || 1;
    // Whole device pixels keep card text sharp inside the moving layer.
    const snap = (v: number) => Math.round(v * dpr) / dpr;
    let idle: ReturnType<typeof setTimeout>;
    const place = (c: Point) => {
      el.style.transform = `translate3d(${snap(size.width / 2 - c.x)}px, ${snap(size.height / 2 - c.y)}px, 0)`;
      // Cards sliding under a still cursor must not fire hover fades mid-pan.
      el.style.pointerEvents = "none";
      clearTimeout(idle);
      idle = setTimeout(() => (el.style.pointerEvents = ""), PAN_IDLE_MS);
    };
    place(readCamera());
    const unsubscribe = subscribe(place);
    return () => {
      unsubscribe();
      clearTimeout(idle);
    };
  }, [size, subscribe, readCamera]);

  return (
    <div
      ref={viewportRef}
      {...handlers}
      className={`relative h-dvh w-full touch-none select-none overflow-hidden bg-black text-white ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{
        backgroundImage:
          "radial-gradient(ellipse at center, #232323 0%, #0a0a0a 45%, #000 75%)",
      }}
    >
      <h1 className="pointer-events-none absolute left-6 top-5 z-20 text-2xl font-semibold tracking-tight text-white/50">
        Website Name
      </h1>

      {projects.length === 0 ? (
        <p className="absolute inset-0 flex items-center justify-center text-white/60">
          No projects to show yet. Check back soon.
        </p>
      ) : null}

      <div
        ref={worldRef}
        className="absolute left-0 top-0 will-change-transform"
      >
        {visible.map((item) => (
          <CanvasCard key={item.project.id} item={item} />
        ))}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{ backgroundImage: VIGNETTE }}
      />

      {!edges.left && (
        <DirectionHint
          icon={ChevronLeft}
          label="Different projects"
          vertical
          className="left-1 top-1/2 -translate-y-1/2"
        />
      )}
      {!edges.right && (
        <DirectionHint
          icon={ChevronRight}
          label="Different projects"
          vertical
          className="right-1 top-1/2 -translate-y-1/2"
        />
      )}
      {!edges.down && (
        <DirectionHint
          icon={ChevronDown}
          label="Similar projects"
          labelFirst
          className="bottom-1 left-1/2 -translate-x-1/2"
        />
      )}

      {edges.left && <EdgeNotice className="left-4 top-1/2 -translate-y-1/2" />}
      {edges.right && (
        <EdgeNotice className="right-4 top-1/2 -translate-y-1/2" />
      )}
      {edges.down && (
        <EdgeNotice className="bottom-14 left-1/2 -translate-x-1/2" />
      )}
    </div>
  );
}
