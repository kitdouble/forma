import type { Template, TemplateConfig, LayoutElement } from "./types";

const CELL_WIDTH = 500;
const CELL_HEIGHT = 375;
const DX_RATIO = 0.82;
const DY_RATIO = 0.38;
const PADDING = 40;
const PANEL_FONT_SIZE = 36;
const LABEL_FONT_SIZE = 30;
const ARROW_STROKE_WIDTH = 3;
const PANEL_LETTER_INSET = 10;
const LABEL_GAP = 36;
const ARROW_GAP = 40;

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const diagonalTimeTemplate: Template = {
  slug: "diagonal-time",
  name: "Diagonal Time Progression",
  description:
    "Overlapping cascade from top-left to bottom-right with a time arrow",
  minImages: 2,
  maxImages: 10,

  computeLayout(config: TemplateConfig) {
    const { images, timingLabels, showPanelLetters, showTimeArrow } = config;
    const n = images.length;
    const dx = CELL_WIDTH * DX_RATIO;
    const dy = CELL_HEIGHT * DY_RATIO;

    const hasTimingLabels = timingLabels.some((l) => l.text.trim().length > 0);

    const elements: LayoutElement[] = [];

    for (let i = 0; i < n; i++) {
      const img = images[i];
      const x = PADDING + i * dx;
      const y = PADDING + i * dy;

      elements.push({
        type: "image",
        imageId: img.id,
        x,
        y,
        width: CELL_WIDTH,
        height: CELL_HEIGHT,
        dataUrl: img.dataUrl,
      });

      if (showPanelLetters) {
        elements.push({
          type: "panel-letter",
          letter: LETTERS[i] || `${i + 1}`,
          x: x + PANEL_LETTER_INSET,
          y: y + PANEL_FONT_SIZE + PANEL_LETTER_INSET - 4,
          fontSize: PANEL_FONT_SIZE,
        });
      }

      const timing = timingLabels.find((l) => l.imageId === img.id);
      if (timing && timing.text.trim()) {
        elements.push({
          type: "label",
          text: timing.text,
          x: x + CELL_WIDTH / 2,
          y: y + CELL_HEIGHT + LABEL_GAP,
          fontSize: LABEL_FONT_SIZE,
        });
      }
    }

    const lastIdx = n - 1;
    const contentBottom =
      PADDING +
      lastIdx * dy +
      CELL_HEIGHT +
      (hasTimingLabels ? LABEL_GAP + LABEL_FONT_SIZE : 0);

    const contentRight = PADDING + lastIdx * dx + CELL_WIDTH;

    let viewBoxHeight: number;
    if (showTimeArrow) {
      const arrowY = contentBottom + ARROW_GAP;
      elements.push({
        type: "arrow",
        x1: PADDING,
        y1: arrowY,
        x2: contentRight,
        y2: arrowY,
        strokeWidth: ARROW_STROKE_WIDTH,
        label: "Time",
      });
      viewBoxHeight = arrowY + 30 + PADDING;
    } else {
      viewBoxHeight = contentBottom + PADDING;
    }

    const viewBoxWidth = contentRight + PADDING;

    return { viewBoxWidth, viewBoxHeight, elements };
  },
};
