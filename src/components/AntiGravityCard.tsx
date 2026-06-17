"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface AntiGravityCardProps {
  children: React.ReactNode;
  className?: string;
  floatDuration?: number;
  floatRange?: number;
  magneticStrength?: number;
  onClick?: () => void;
}

export default function AntiGravityCard({
  children,
  className = "",
  floatDuration = 6,
  floatRange = 6,
  magneticStrength = 15,
  onClick,
}: AntiGravityCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse coords relative to card
  const mouseX = useSpring(0, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Normalize coordinates based on strength
    mouseX.set((x / (rect.width / 2)) * magneticStrength);
    mouseY.set((y / (rect.height / 2)) * magneticStrength);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Convert spring values to transform coordinates
  const moveX = useTransform(mouseX, (v) => v);
  const moveY = useTransform(mouseY, (v) => v);

  const glowX = useTransform(mouseX, (x) => `calc(50% + ${x * 1.5}px - 125px)`);
  const glowY = useTransform(mouseY, (y) => `calc(50% + ${y * 1.5}px - 125px)`);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        x: moveX,
        y: moveY,
        z: isHovered ? 20 : 0,
      }}
      animate={{
        translateY: isHovered ? 0 : [floatRange, -floatRange, floatRange],
      }}
      transition={{
        translateY: {
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      className={`glass-panel rounded-2xl relative overflow-hidden transition-shadow duration-500 cursor-pointer select-none border border-[rgba(255,255,255,0.08)] ${className}`}
    >
      {/* Glow highlight follow cursor */}
      {isHovered && (
        <motion.div
          className="absolute pointer-events-none rounded-full blur-[80px] opacity-40 z-0 bg-radial from-[#8B5CF6] to-transparent"
          style={{
            width: 250,
            height: 250,
            left: glowX,
            top: glowY,
          }}
        />
      )}

      {/* Floating subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none z-0" />
      
      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}
