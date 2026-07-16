"use client";

import { useRef, useState, useCallback } from "react";

interface DropzoneProps {
  onFiles: (files: File[]) => void;
  imageCount: number;
  maxImages: number;
}

export function Dropzone({ onFiles, imageCount, maxImages }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      onFiles(files);
    },
    [onFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        onFiles(Array.from(e.target.files));
        e.target.value = "";
      }
    },
    [onFiles]
  );

  const isFull = imageCount >= maxImages;

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => !isFull && inputRef.current?.click()}
      className={`
        border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors
        ${imageCount > 0 ? "p-4" : "p-12"}
        ${dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
        ${isFull ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      <div className="text-gray-500">
        {isFull ? (
          <p className="text-sm">Maximum {maxImages} images reached</p>
        ) : (
          <>
            {imageCount === 0 ? (
              <>
                <p className="text-lg font-medium mb-1">
                  Drop experiment screenshots here
                </p>
                <p className="text-sm">
                  or click to browse ({imageCount}/{maxImages})
                </p>
              </>
            ) : (
              <p className="text-sm">
                Add more images ({imageCount}/{maxImages})
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
