"use client";

import { useRef, useState } from "react";
import type { UploadedImage, TimingLabel } from "@/templates/types";

interface ImageListProps {
  images: UploadedImage[];
  timingLabels: TimingLabel[];
  onRemove: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onTimingChange: (imageId: string, text: string) => void;
}

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function ImageList({
  images,
  timingLabels,
  onRemove,
  onReorder,
  onTimingChange,
}: ImageListProps) {
  const dragIdx = useRef<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {images.map((img, i) => {
        const timing = timingLabels.find((l) => l.imageId === img.id);
        return (
          <div
            key={img.id}
            draggable
            onDragStart={() => {
              dragIdx.current = i;
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverIdx(i);
            }}
            onDragLeave={() => setDragOverIdx(null)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOverIdx(null);
              if (dragIdx.current !== null && dragIdx.current !== i) {
                onReorder(dragIdx.current, i);
              }
              dragIdx.current = null;
            }}
            className={`
              shrink-0 w-36 rounded-lg border bg-white overflow-hidden
              ${dragOverIdx === i ? "ring-2 ring-blue-400" : "border-gray-200"}
            `}
          >
            <div className="relative">
              <img
                src={img.dataUrl}
                alt={img.originalName}
                className="w-full h-24 object-cover"
                draggable={false}
              />
              <span className="absolute top-1 left-1 bg-black/60 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                {LETTERS[i]}
              </span>
              <button
                onClick={() => onRemove(img.id)}
                className="absolute top-1 right-1 bg-black/60 text-white text-xs w-5 h-5 rounded flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                x
              </button>
            </div>
            <div className="p-1.5">
              <input
                type="text"
                placeholder="e.g. 0 min"
                value={timing?.text ?? ""}
                onChange={(e) => onTimingChange(img.id, e.target.value)}
                className="w-full text-xs border rounded px-1.5 py-1 text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
