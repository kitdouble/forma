"use client";

export function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="4"
        y="4"
        width="20"
        height="15"
        rx="2"
        fill="#2563eb"
        opacity={0.85}
      />
      <rect
        x="14"
        y="14"
        width="20"
        height="15"
        rx="2"
        fill="#3b82f6"
        opacity={0.85}
      />
      <rect
        x="24"
        y="24"
        width="20"
        height="15"
        rx="2"
        fill="#60a5fa"
        opacity={0.85}
      />
      <line
        x1="6"
        y1="44"
        x2="42"
        y2="44"
        stroke="#94a3b8"
        strokeWidth="2"
        strokeLinecap="round"
        markerEnd="url(#logo-arrow)"
      />
      <defs>
        <marker
          id="logo-arrow"
          markerWidth="6"
          markerHeight="5"
          refX="5"
          refY="2.5"
          orient="auto"
        >
          <polygon points="0 0, 6 2.5, 0 5" fill="#94a3b8" />
        </marker>
      </defs>
    </svg>
  );
}
