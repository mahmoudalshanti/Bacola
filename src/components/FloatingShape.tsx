"use client";
import { motion } from "framer-motion";
function FloatingShape({
  color,
  size,
  top,
  left,
  delay,
  className,
}: {
  color: string;
  size: string;
  top: string;
  left: string;
  delay: number;
  className: string;
}) {
  return (
    <motion.div
      className={`absolute rounded-full ${color} ${size} opacity-20 blur-xl -z-10 ${className} `}
      style={{ top, left }}
      animate={{
        y: ["0%", "100%", "0%"],
        x: ["0%", "100%", "0%"],
        rotate: [0, 360],
      }}
      transition={{
        duration: 20,
        ease: "linear",
        repeat: Infinity,
        delay,
      }}
      aria-hidden="true"
    />
  );
}

export default FloatingShape;
