"use client";

import { motion, useAnimation } from "motion/react";
import { useState, useRef } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type VariantProps } from "class-variance-authority";
import { IconCircleCheck } from "@tabler/icons-react";

interface HoldButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  holdDuration?: number;
  onComplete?: () => void;
}

export default function HoldButton({
  className,
  variant = "default",
  size = "default",
  holdDuration = 2000,
  onComplete,
  children,
  ...props
}: HoldButtonProps) {
  const [isHolding, setIsHolding] = useState(false);
  const controls = useAnimation();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  async function handleHoldStart() {
    setIsHolding(true);
    controls.set({ width: "0%" });

    // Mulai animasi progress bar
    controls.start({
      width: "100%",
      transition: {
        duration: holdDuration / 1000,
        ease: "linear",
      },
    });

    // Set timeout untuk eksekusi fungsi setelah durasi selesai
    timerRef.current = setTimeout(() => {
      if (onComplete) onComplete();
      handleHoldEnd();
    }, holdDuration);
  }

  function handleHoldEnd() {
    setIsHolding(false);
    if (timerRef.current) clearTimeout(timerRef.current);

    controls.stop();
    controls.start({
      width: "0%",
      transition: { duration: 0.2 },
    });
  }

  // Helper untuk menentukan warna progress bar berdasarkan variant tombol
  const getProgressColor = () => {
    switch (variant) {
      case "destructive":
        return "bg-white/30";
      case "outline":
      case "ghost":
      case "secondary":
        return "bg-primary/20";
      default:
        return "bg-black/20"; // Untuk variant default (primary)
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("relative overflow-hidden touch-none", className)}
      onMouseDown={handleHoldStart}
      onMouseLeave={handleHoldEnd}
      onMouseUp={handleHoldEnd}
      onTouchStart={handleHoldStart}
      onTouchEnd={handleHoldEnd}
      {...props}
    >
      {/* Progress Bar Overlay */}
      <motion.div
        animate={controls}
        initial={{ width: "0%" }}
        className={cn(
          "absolute left-0 top-0 h-full pointer-events-none",
          getProgressColor(),
        )}
      />

      {/* Content */}
      <span className="relative z-10 flex w-full items-center justify-center gap-2 pointer-events-none">
        {isHolding && <IconCircleCheck className="size-4 animate-pulse" />}

        <span>{isHolding ? "Tahan..." : children}</span>
      </span>
    </Button>
  );
}
