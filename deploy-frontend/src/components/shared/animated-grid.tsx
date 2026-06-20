"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedGridProps {
  children: React.ReactNode[];
  className?: string;
  stagger?: number;
}

export function AnimatedGrid({ children, className, stagger = 0.05 }: AnimatedGridProps) {
  return (
    <div className={cn("grid gap-6", className)}>
      {children.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * stagger }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
