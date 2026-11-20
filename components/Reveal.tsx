"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075, delayChildren: 0.04 } },
};

const line: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * Wrap a block in <Reveal> and each line in <Line>: as the block scrolls into
 * view its lines appear one after another, quickly and softly. With reduced
 * motion switched on, lines simply fade (the slide is dropped by MotionConfig).
 */
export function Reveal({ children, className, amount = 0.2 }: { children: ReactNode; className?: string; amount?: number }) {
  return (
    <motion.div className={className} variants={group} initial="hidden" whileInView="show" viewport={{ once: true, amount }}>
      {children}
    </motion.div>
  );
}

export function Line({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={line}>
      {children}
    </motion.div>
  );
}
