import { motion, useReducedMotion } from "framer-motion";
import React from "react";

export const RouteTransition = ({ children }: { children: React.ReactNode }) => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? undefined : { opacity: 0, y: 10 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: 10 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};
