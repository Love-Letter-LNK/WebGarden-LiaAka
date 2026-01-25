import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type AnimatedSectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  /** For section wrappers that should render semantic tags */
  as?: "section" | "div";
};

export const AnimatedSection = ({
  children,
  id,
  className,
  as = "section",
}: AnimatedSectionProps) => {
  const reduce = useReducedMotion();

  const MotionTag = as === "div" ? motion.div : motion.section;

  return (
    <MotionTag
      id={id}
      className={className}
      initial={reduce ? undefined : { opacity: 0, y: 14 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </MotionTag>
  );
};
