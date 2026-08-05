import type { Template, TemplateConfig, LayoutElement } from "./types";

const CELL_WIDTH = 500;
const CELL_HEIGHT = 500;
const GAP = 30;
const PADDING = 40;
const PANEL_FONT_SIZE = 36;
const LABEL_FONT_SIZE = 30;
const PANEL_LETTER_INSET = 10;
const LABEL_GAP = 36;

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const sideBySideTemplate: Template = {
  slug: "side-by-side",
  name: "Side by Side",
  description: "Equal-sized panels in a horizontal row",
  minImages: 2,
  maxImages: 10,

  computeLayout(config: TemplateConfig) {
    const { images, timingLabels, showPanelLetters } = config;
    const n = images.length;

    const hasTimingLabels = timingLabels.some((l) => l.text.trim().length > 0);

    const elements: LayoutElement[] = [];

    for (let i = 0; i < n; i++) {
      const img = images[i];
      const x = PADDING + i * (CELL_WIDTH + GAP);
      const y = PADDING;

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

    const contentBottom =
      PADDING +
      CELL_HEIGHT +
      (hasTimingLabels ? LABEL_GAP + LABEL_FONT_SIZE : 0);

    const viewBoxWidth = PADDING + n * CELL_WIDTH + (n - 1) * GAP + PADDING;
    const viewBoxHeight = contentBottom + PADDING;

    return { viewBoxWidth, viewBoxHeight, elements };
  },
};
