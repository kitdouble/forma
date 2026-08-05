import { diagonalTimeTemplate } from "./diagonal-time";
import { sideBySideTemplate } from "./side-by-side";
import type { Template } from "./types";

export const templates: Record<string, Template> = {
  "diagonal-time": diagonalTimeTemplate,
  "side-by-side": sideBySideTemplate,
};

export const templateList: Template[] = Object.values(templates);

export const defaultTemplateSlug = "diagonal-time";
