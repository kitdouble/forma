function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function exportPng(
  svgElement: SVGSVGElement,
  dpi: number = 300
): Promise<void> {
  const scaleFactor = dpi / 96;
  const vbWidth = svgElement.viewBox.baseVal.width;
  const vbHeight = svgElement.viewBox.baseVal.height;

  const pxWidth = Math.round(vbWidth * scaleFactor);
  const pxHeight = Math.round(vbHeight * scaleFactor);

  const clone = svgElement.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("width", String(pxWidth));
  clone.setAttribute("height", String(pxHeight));

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clone);
  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.width = pxWidth;
  img.height = pxHeight;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pxWidth;
      canvas.height = pxHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, pxWidth, pxHeight);
      ctx.drawImage(img, 0, 0, pxWidth, pxHeight);
      canvas.toBlob(
        (blob) => {
          if (blob) downloadBlob(blob, "forma-figure.png");
          URL.revokeObjectURL(url);
          resolve();
        },
        "image/png"
      );
    };
    img.onerror = reject;
    img.src = url;
  });
}
