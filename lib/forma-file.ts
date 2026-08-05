import type { UploadedImage, TimingLabel } from "@/templates/types";

interface FormaFile {
  version: 1;
  templateSlug: string;
  images: UploadedImage[];
  timingLabels: TimingLabel[];
  showPanelLetters: boolean;
  showTimeArrow: boolean;
}

export type FormaProject = Omit<FormaFile, "version">;

export function saveFormaFile(project: FormaProject) {
  const data: FormaFile = { version: 1, ...project };
  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "figure.forma";
  a.click();
  URL.revokeObjectURL(url);
}

export function loadFormaFile(file: File): Promise<FormaProject> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as FormaFile;
        if (data.version !== 1) {
          reject(new Error("Unsupported .forma file version"));
          return;
        }
        resolve({
          templateSlug: data.templateSlug,
          images: data.images,
          timingLabels: data.timingLabels,
          showPanelLetters: data.showPanelLetters,
          showTimeArrow: data.showTimeArrow,
        });
      } catch {
        reject(new Error("Invalid .forma file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
