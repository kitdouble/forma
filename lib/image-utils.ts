const MAX_DIMENSION = 2000;

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function getImageDimensions(
  dataUrl: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () =>
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = dataUrl;
  });
}

export async function resizeImage(dataUrl: string): Promise<string> {
  const { width, height } = await getImageDimensions(dataUrl);
  if (width <= MAX_DIMENSION && height <= MAX_DIMENSION) return dataUrl;

  const scale = MAX_DIMENSION / Math.max(width, height);
  const newW = Math.round(width * scale);
  const newH = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = newW;
  canvas.height = newH;

  const ctx = canvas.getContext("2d")!;
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0, newW, newH);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Failed to resize image"));
    img.src = dataUrl;
  });
}
