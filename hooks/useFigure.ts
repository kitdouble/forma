"use client";

import { useMemo } from "react";
import type { UploadedImage, TimingLabel, LayoutResult } from "@/templates/types";
import { templates } from "@/templates/registry";

export function useFigure(
  images: UploadedImage[],
  templateSlug: string,
  timingLabels: TimingLabel[],
  showPanelLetters: boolean,
  showTimeArrow: boolean
): LayoutResult | null {
  return useMemo(() => {
    const template = templates[templateSlug];
    if (!template) return null;
    if (images.length < template.minImages) return null;

    return template.computeLayout({ images, timingLabels, showPanelLetters, showTimeArrow });
  }, [images, templateSlug, timingLabels, showPanelLetters, showTimeArrow]);
}
