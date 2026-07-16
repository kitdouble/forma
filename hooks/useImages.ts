"use client";

import { useState, useCallback } from "react";
import type { UploadedImage } from "@/templates/types";
import {
  readFileAsDataUrl,
  getImageDimensions,
  resizeImage,
} from "@/lib/image-utils";

const MAX_IMAGES = 10;

export function useImages() {
  const [images, setImages] = useState<UploadedImage[]>([]);

  const addFiles = useCallback(
    async (files: File[]) => {
      const imageFiles = files.filter((f) => f.type.startsWith("image/"));
      const remaining = MAX_IMAGES - images.length;
      const toAdd = imageFiles.slice(0, remaining);

      const newImages: UploadedImage[] = [];
      for (const file of toAdd) {
        const raw = await readFileAsDataUrl(file);
        const dataUrl = await resizeImage(raw);
        const dims = await getImageDimensions(dataUrl);
        newImages.push({
          id: crypto.randomUUID(),
          dataUrl,
          originalName: file.name,
          width: dims.width,
          height: dims.height,
        });
      }

      setImages((prev) => [...prev, ...newImages]);
    },
    [images.length]
  );

  const removeImage = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  const reorderImages = useCallback(
    (fromIndex: number, toIndex: number) => {
      setImages((prev) => {
        const next = [...prev];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        return next;
      });
    },
    []
  );

  const clearAll = useCallback(() => setImages([]), []);

  return { images, addFiles, removeImage, reorderImages, clearAll };
}
