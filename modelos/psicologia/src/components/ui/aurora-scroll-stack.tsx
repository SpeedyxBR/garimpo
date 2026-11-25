"use client";

import {
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import type { ReactNode } from "react";
import { createContext, useContext, useRef } from "react";

type AuroraScrollStackItemProps = {
  children: ReactNode;
  index: number;
};

const StackProgressContext = createContext<MotionValue<number> | null>(null);

export function AuroraScrollStack({ children }: { children: ReactNode }) {
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start 16%", "end 84%"],
  });

  return (
    <StackProgressContext.Provider value={scrollYProgress}>
      <div className="v3-scroll-stack" ref={stackRef}>{children}</div>
    </StackProgressContext.Provider>
  );
}

export function AuroraScrollStackItem({
  children,
  index,
}: AuroraScrollStackItemProps) {
  const reduceMotion = useReducedMotion();
  const fallbackProgress = useMotionValue(0);
  const stackProgress = useContext(StackProgressContext) ?? fallbackProgress;
  const transitionStart = 0.08 + index * 0.3;
  const transitionEnd = transitionStart + 0.24;
  const localProgress = useTransform(
    stackProgress,
    [transitionStart, transitionEnd],
    [0, 1],
    { clamp: true },
  );

  const scaleValue = useTransform(localProgress, [0, 0.55, 1], [1, 1, 0.94]);
  const descendValue = useTransform(localProgress, [0, 0.52, 1], [0, 0, 46]);
  const shadowValue = useTransform(
    localProgress,
    [0, 0.58, 1],
    [
      "0 24px 70px rgba(36, 35, 31, 0.08)",
      "0 24px 70px rgba(36, 35, 31, 0.08)",
      "0 12px 34px rgba(36, 35, 31, 0.04)",
    ],
  );

  const scale = useSpring(scaleValue, { stiffness: 170, damping: 28, mass: 0.35 });
  const y = useSpring(descendValue, { stiffness: 150, damping: 26, mass: 0.4 });

  return (
    <motion.div
      className="v3-scroll-stack__sticky"
      style={
        reduceMotion
          ? { zIndex: index + 1 }
          : {
              zIndex: index + 1,
              scale,
              y,
              boxShadow: shadowValue,
            }
      }
    >
      {children}
    </motion.div>
  );
}
