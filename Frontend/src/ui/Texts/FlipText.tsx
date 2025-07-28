import React from "react";
import { motion, type Variants } from "framer-motion";

/**
 * A lightweight, fully‑typed rotating‑text component inspired by React Bits.
 * Works out‑of‑the‑box with Vite + React + TypeScript + Tailwind.
 *
 * ```tsx
 * <h1 className="text-5xl font-extrabold">
 *   Build&nbsp;
 *   <RotatingText text="FASTER" className="text-indigo-400" />
 *   &nbsp;with React
 * </h1>
 * ```
 */
export interface RotatingTextProps {
  /** Word or short phrase to animate */
  text: string;
  /** Delay between each character’s entrance (seconds). Default: 0.1 s */
  stagger?: number;
  /** Animation duration for every character (seconds or per-character array). Default: 0.5 s */
  timing?: number | number[];
  /** Tailwind / CSS utility classes for the wrapper */
  className?: string;
}

const FlipText: React.FC<RotatingTextProps> = ({
  text,
  stagger = 0.1,
  timing = 0.5,
  className = "",
}) => {
  // Split text into an array of characters so we can animate them individually
  const letters = React.useMemo(() => Array.from(text), [text]);

  // Motion variants for container and each child character
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
      },
    },
  };

  const charVariants: Variants = {
    hidden: {
      rotateX: 90,
      opacity: 0,
    },
    visible: {
      rotateX: 0,
      opacity: 1,
      transition: {
        duration: timing as number,
        ease: [0.25, 0.1, 0.25, 1], // cubic‑bezier similar to React Bits default
      },
    },
  };

  return (
    <motion.span
      className={`inline-block [perspective:600px] ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {letters.map((char, index) => (
        <motion.span key={index} className="inline-block" variants={charVariants}>
          {char === " " ? "\u00a0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default FlipText;
