"use client";

import { cn } from "@/utils/cn";
import {
  ComponentPropsWithoutRef,
  ElementRef,
  ReactNode,
  forwardRef,
  useMemo,
} from "react";
import { m, useSpring } from "framer-motion";

export const RadialFab = forwardRef<
  ElementRef<"div">,
  ComponentPropsWithoutRef<"div">
>((props, ref) => {
  const { className, ...rest } = props;

  return (
    <div
      {...rest}
      className={cn(
        "relative flex flex-row items-center justify-center",
        className
      )}
    />
  );
});

export const RadialFabButton = forwardRef<
  ElementRef<"button">,
  ComponentPropsWithoutRef<"button"> &
    (
      | { variant?: "main" }
      | { variant?: "sub"; open?: boolean; angle: number; radius: string }
    )
>((props, ref) => {
  const { className, variant = "main", style, ...rest } = props;

  const { angle, radius, open } = props as Partial<
    typeof props & { variant: "sub" }
  >;

  return (
    <button
      {...rest}
      className={cn(
        "rounded-full aspect-square bg-primary text-primary-foreground flex flex-row items-center justify-center transition-transform active:scale-90",
        variant === "main" && "w-20 text-4xl z-10",
        variant === "sub" && "absolute  w-[60px] text-2xl",
        className
      )}
      style={{
        transform: `rotate(${angle}deg) translateY(${
          open ? radius : 0
        }) rotate(${-(angle || 0)}deg)`,
        ...style,
      }}
    />
  );
});

export const RadialFabIcon = forwardRef<
  ElementRef<"i">,
  ComponentPropsWithoutRef<"i">
>((props, ref) => {
  const { className, ...rest } = props;

  return <i {...rest} className={cn("", className)} />;
});
