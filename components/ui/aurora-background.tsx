"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
  intensity?: "quiet" | "hero";
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  intensity = "hero",
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "aurora-background",
        intensity === "quiet" && "aurora-background-quiet",
        className
      )}
      {...props}
    >
      <div className="aurora-field" aria-hidden="true">
        <div
          className={cn(
            "aurora-layer",
            showRadialGradient && "aurora-layer-masked"
          )}
        />
      </div>
      <div className="aurora-content">{children}</div>
    </div>
  );
};
