import { diagonalTimeTemplate } from "./diagonal-time";
import type { Template } from "./types";

export const templates: Record<string, Template> = {
  "diagonal-time": diagonalTimeTemplate,
};

export const defaultTemplateSlug = "diagonal-time";
