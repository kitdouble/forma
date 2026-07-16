"use client";

import { forwardRef } from "react";
import type { LayoutResult, LayoutElement } from "@/templates/types";

interface FigurePreviewProps {
  layout: LayoutResult;
}

function renderElement(el: LayoutElement, index: number) {
  switch (el.type) {
    case "image":
      return (
        <image
          key={`img-${el.imageId}`}
          href={el.dataUrl}
          x={el.x}
          y={el.y}
          width={el.width}
          height={el.height}
          preserveAspectRatio="xMidYMid meet"
        />
      );

    case "panel-letter": {
      const boxSize = el.fontSize + 8;
      const boxX = el.x - 2;
      const boxY = el.y - el.fontSize + 2;
      return (
        <g key={`letter-${el.letter}`}>
          <rect
            x={boxX}
            y={boxY}
            width={boxSize}
            height={boxSize}
            rx={4}
            fill="rgba(0,0,0,0.7)"
          />
          <text
            x={boxX + boxSize / 2}
            y={boxY + boxSize / 2}
            fontFamily="Arial, Helvetica, sans-serif"
            fontWeight="bold"
            fontSize={el.fontSize}
            fill="#ffffff"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {el.letter}
          </text>
        </g>
      );
    }

    case "label":
      return (
        <text
          key={`label-${index}`}
          x={el.x}
          y={el.y}
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize={el.fontSize}
          fill="#333"
          textAnchor="middle"
        >
          {el.text}
        </text>
      );

    case "arrow": {
      const midX = (el.x1 + el.x2) / 2;
      const midY = (el.y1 + el.y2) / 2;

      return (
        <g key="arrow">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="12"
              markerHeight="8"
              refX="11"
              refY="4"
              orient="auto"
            >
              <polygon points="0 0, 12 4, 0 8" fill="#555" />
            </marker>
          </defs>
          <line
            x1={el.x1}
            y1={el.y1}
            x2={el.x2}
            y2={el.y2}
            stroke="#555"
            strokeWidth={el.strokeWidth}
            markerEnd="url(#arrowhead)"
          />
          {el.label && (
            <text
              x={midX}
              y={midY - 12}
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize={22}
              fill="#555"
              textAnchor="middle"
              fontStyle="italic"
            >
              {el.label}
            </text>
          )}
        </g>
      );
    }
  }
}

export const FigurePreview = forwardRef<SVGSVGElement, FigurePreviewProps>(
  function FigurePreview({ layout }, ref) {
    return (
      <div className="flex justify-center rounded-lg border border-gray-200 bg-gray-50 p-4 overflow-auto" style={{ maxHeight: "45vh" }}>
        <svg
          ref={ref}
          viewBox={`0 0 ${layout.viewBoxWidth} ${layout.viewBoxHeight}`}
          xmlns="http://www.w3.org/2000/svg"
          className="bg-white shadow-sm"
          style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto" }}
        >
          <rect
            width={layout.viewBoxWidth}
            height={layout.viewBoxHeight}
            fill="#ffffff"
          />
          {layout.elements.map((el, i) => renderElement(el, i))}
          {layout.elements
            .filter((el): el is import("@/templates/types").ImageElement => el.type === "image")
            .map((el) => (
              <rect
                key={`border-${el.imageId}`}
                x={el.x}
                y={el.y}
                width={el.width}
                height={el.height}
                fill="none"
                stroke="#333"
                strokeWidth={1.5}
              />
            ))}
        </svg>
      </div>
    );
  }
);
