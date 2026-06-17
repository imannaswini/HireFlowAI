"use client";

import React from "react";
import { motion } from "framer-motion";

interface OrbitalRingProps {
  className?: string;
  size?: number;
  duration?: number;
  reverse?: boolean;
  color?: string;
}

export default function OrbitalRing({
  className = "",
  size = 300,
  duration = 20,
  reverse = false,
  color = "from-[#4F46E5] via-[#06B6D4] to-[#8B5CF6]",
}: OrbitalRingProps) {
  return (
    <div
      className={`absolute pointer-events-none flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer rotating ring */}
      <motion.div
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{
          repeat: Infinity,
          duration: duration,
          ease: "linear",
        }}
        className={`w-full h-full rounded-full border border-dashed border-white/10 relative`}
      >
        {/* Glow Node */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-r ${color} shadow-[0_0_15px_#06B6D4]`} />
      </motion.div>

      {/* Inner faint ring */}
      <div
        className="absolute rounded-full border border-white/5"
        style={{ width: size * 0.7, height: size * 0.7 }}
      />
    </div>
  );
}
