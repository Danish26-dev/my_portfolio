"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { pathState } from "@/lib/utils";

/** Water Phoenix mark: a droplet body, two swept wings and a wave tail. */
export function PhoenixMark({
  size = 32,
  draw = false,
  className,
}: {
  size?: number;
  draw?: boolean;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const paths = [
    "M16 4.5 C19.6 9.2 20.8 13.4 16 20.5 C11.2 13.4 12.4 9.2 16 4.5 Z",
    "M13.6 16.2 C8.6 16.6 4.6 12.8 2.6 6.6 C6.4 8.8 9.8 8.6 12.8 11.4",
    "M18.4 16.2 C23.4 16.6 27.4 12.8 29.4 6.6 C25.6 8.8 22.2 8.6 19.2 11.4",
    "M16 20.5 C14 23.2 15 25.6 16 28.4 C17 25.6 18 23.2 16 20.5",
    "M10.4 24.2 q2.8 -2.6 5.6 0 t5.6 0",
  ];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id={`g${id}`} x1="4" y1="4" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1546D9" />
          <stop offset="0.6" stopColor="#1546D9" />
          <stop offset="1" stopColor="#F9B318" />
        </linearGradient>
      </defs>
      {paths.map((d, i) =>
        draw ? (
          <motion.path
            key={i}
            d={d}
            stroke={`url(#g${id})`}
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={pathState(0, { opacity: 0 })}
            animate={pathState(1, { opacity: 1 })}
            transition={{ duration: 1, delay: i * 0.18, ease: "easeInOut" }}
          />
        ) : (
          <path
            key={i}
            d={d}
            stroke={`url(#g${id})`}
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={i === 0 ? `url(#g${id})` : "none"}
            fillOpacity={i === 0 ? 0.18 : 0}
          />
        )
      )}
    </svg>
  );
}
