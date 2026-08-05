"use client";

import { useRef, useState, useCallback } from "react";
import type { TimingLabel } from "@/templates/types";
import { useImages } from "@/hooks/useImages";
import { useFigure } from "@/hooks/useFigure";
import { defaultTemplateSlug, templateList, templates } from "@/templates/registry";
import { saveFormaFile, loadFormaFile } from "@/lib/forma-file";
import { Dropzone } from "./Dropzone";
import { ImageList } from "./ImageList";
import { FigurePreview } from "./FigurePreview";
import { ExportControls } from "./ExportControls";
import { Logo } from "./Logo";

export function AppShell() {
  const { images, setImages, addFiles, removeImage, reorderImages, clearAll } =
    useImages();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [timingLabels, setTimingLabels] = useState<TimingLabel[]>([]);
  const [showPanelLetters, setShowPanelLetters] = useState(true);
  const [showTimeArrow, setShowTimeArrow] = useState(true);
  const [templateSlug, setTemplateSlug] = useState(defaultTemplateSlug);
  const svgRef = useRef<SVGSVGElement>(null);

  const layout = useFigure(images, templateSlug, timingLabels, showPanelLetters, showTimeArrow);

  const handleTimingChange = useCallback((imageId: string, text: string) => {
    setTimingLabels((prev) => {
      const existing = prev.findIndex((l) => l.imageId === imageId);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = { imageId, text };
        return next;
      }
      return [...prev, { imageId, text }];
    });
  }, []);

  const handleSave = useCallback(() => {
    saveFormaFile({
      templateSlug,
      images,
      timingLabels,
      showPanelLetters,
      showTimeArrow,
    });
  }, [templateSlug, images, timingLabels, showPanelLetters, showTimeArrow]);

  const handleLoad = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const project = await loadFormaFile(file);
        setImages(project.images);
        setTimingLabels(project.timingLabels);
        setShowPanelLetters(project.showPanelLetters);
        setShowTimeArrow(project.showTimeArrow);
        if (templates[project.templateSlug]) {
          setTemplateSlug(project.templateSlug);
        }
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to open file");
      }
      e.target.value = "";
    },
    [setImages]
  );

  const handleRemove = useCallback(
    (id: string) => {
      removeImage(id);
      setTimingLabels((prev) => prev.filter((l) => l.imageId !== id));
    },
    [removeImage]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200/80 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={38} />
            <div>
              <h1
                className="text-2xl tracking-tight"
                style={{ fontFamily: "var(--font-dm-serif), serif" }}
              >
                Forma
              </h1>
              <p className="text-xs tracking-wide uppercase text-gray-400" style={{ letterSpacing: "0.1em" }}>
                Publication-ready figures
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".forma"
              onChange={handleLoad}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              Open
            </button>
            {images.length > 0 && (
              <>
                <button
                  onClick={handleSave}
                  className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={clearAll}
                  className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                  Clear all
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-6">
        <div className="max-w-6xl mx-auto space-y-5">
          {images.length === 0 ? (
            <Dropzone onFiles={addFiles} imageCount={0} maxImages={10} />
          ) : (
            <>
              <ImageList
                images={images}
                timingLabels={timingLabels}
                onRemove={handleRemove}
                onReorder={reorderImages}
                onTimingChange={handleTimingChange}
              />
              {images.length < 10 && (
                <Dropzone onFiles={addFiles} imageCount={images.length} maxImages={10} />
              )}
            </>
          )}

          {images.length >= 2 && (
            <div className="flex flex-wrap gap-2">
              {templateList.map((t) => (
                <button
                  key={t.slug}
                  onClick={() => setTemplateSlug(t.slug)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    templateSlug === t.slug
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          )}

          {layout && (
            <>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showPanelLetters}
                    onChange={(e) => setShowPanelLetters(e.target.checked)}
                    className="rounded"
                  />
                  Panel labels (A, B, C...)
                </label>
                {templateSlug === "diagonal-time" && (
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={showTimeArrow}
                      onChange={(e) => setShowTimeArrow(e.target.checked)}
                      className="rounded"
                    />
                    Time arrow
                  </label>
                )}
              </div>
              <FigurePreview ref={svgRef} layout={layout} />
              <ExportControls svgRef={svgRef} />
            </>
          )}

          {images.length > 0 && images.length < 2 && (
            <p className="text-sm text-amber-600">
              Add at least 2 images to generate the figure
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
