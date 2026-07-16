"use client";

import { useState, type RefObject } from "react";
import { exportPng } from "@/lib/export-png";
import { exportSvg } from "@/lib/export-svg";

interface ExportControlsProps {
  svgRef: RefObject<SVGSVGElement | null>;
}

const DPI_OPTIONS = [150, 300, 600];

export function ExportControls({ svgRef }: ExportControlsProps) {
  const [dpi, setDpi] = useState(300);
  const [exporting, setExporting] = useState(false);

  const handleExportPng = async () => {
    if (!svgRef.current) return;
    setExporting(true);
    try {
      await exportPng(svgRef.current, dpi);
    } finally {
      setExporting(false);
    }
  };

  const handleExportSvg = () => {
    if (!svgRef.current) return;
    exportSvg(svgRef.current);
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">DPI:</label>
        <select
          value={dpi}
          onChange={(e) => setDpi(Number(e.target.value))}
          className="text-sm border rounded px-2 py-1.5 bg-white text-gray-700"
        >
          {DPI_OPTIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleExportPng}
        disabled={exporting}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {exporting ? "Exporting..." : "Export PNG"}
      </button>

      <button
        onClick={handleExportSvg}
        className="px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
      >
        Export SVG
      </button>
    </div>
  );
}
