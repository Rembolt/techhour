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
  /** World-space x of the middle column's centre. */
  homeX: number;
};

/**
 * Places projects on a grid, then shifts each card by a seeded random offset
 * so they look scattered. Columns are "different projects", rows are
 * "similar projects".
 *
 * `scale` shrinks every distance for small screens. `spreadX` scales the
 * sideways scatter; 0 lines each column up so a card can sit centred.
 */
export function buildLayout(
  projects: Project[],
  scale = 1,
  spreadX = 1,
): WorldLayout {
  const cols = Math.max(1, Math.ceil(projects.length / ROWS));
  const rows = Math.min(ROWS, Math.max(1, projects.length));

  const rng = createRng(LAYOUT_SEED);

  const items = projects.map((project, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const offsetX = (rng() * 2 - 1) * JITTER_X * spreadX;
    const offsetY = (rng() * 2 - 1) * JITTER_Y;
    return {
      project,
      x: (col * CELL_WIDTH + (CELL_WIDTH - CARD_WIDTH) / 2 + offsetX) * scale,
      y: (row * CELL_HEIGHT + (CELL_HEIGHT - CARD_HEIGHT) / 2 + offsetY) * scale,
    };
  });

  return {
    items,
    width: cols * CELL_WIDTH * scale,
    height: rows * CELL_HEIGHT * scale,
    homeX: (Math.floor(cols / 2) + 0.5) * CELL_WIDTH * scale,
  };
}
