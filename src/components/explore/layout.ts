import { Project } from "@/types/project";
import { createRng } from "./seededRandom";

/** Fixed seed: the scattered layout is the same on every load. */
const LAYOUT_SEED = 20260;

/** Size of a rendered ProjectCard. */
export const CARD_WIDTH = 296;
export const CARD_HEIGHT = 272;

/** Size of one grid cell. The space around the card is room for the offset. */
export const CELL_WIDTH = 400;
export const CELL_HEIGHT = 380;

/** Gap between the screen edge and the content when panning stops. */
export const VIEW_INSETS = { left: 40, top: 96, right: 40, bottom: 140 };

const JITTER_X = (CELL_WIDTH - CARD_WIDTH) / 2 - 8;
const JITTER_Y = (CELL_HEIGHT - CARD_HEIGHT) / 2 - 8;
const ROWS = 3;

export type PlacedProject = {
  project: Project;
  /** World-space top-left of the card. */
  x: number;
  y: number;
};

export type WorldLayout = {
  items: PlacedProject[];
  width: number;
  height: number;
};

/**
 * Places projects on a grid, then shifts each card by a seeded random offset
 * so they look scattered. Columns are "different projects", rows are
 * "similar projects".
 */
export function buildLayout(projects: Project[]): WorldLayout {
  const cols = Math.max(1, Math.ceil(projects.length / ROWS));
  const rows = Math.min(ROWS, Math.max(1, projects.length));

  const rng = createRng(LAYOUT_SEED);

  const items = projects.map((project, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const offsetX = (rng() * 2 - 1) * JITTER_X;
    const offsetY = (rng() * 2 - 1) * JITTER_Y;
    return {
      project,
      x: col * CELL_WIDTH + (CELL_WIDTH - CARD_WIDTH) / 2 + offsetX,
      y: row * CELL_HEIGHT + (CELL_HEIGHT - CARD_HEIGHT) / 2 + offsetY,
    };
  });

  return { items, width: cols * CELL_WIDTH, height: rows * CELL_HEIGHT };
}
