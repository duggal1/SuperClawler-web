/* eslint-disable prefer-const */
"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { animate } from "motion/react";

interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "white"; // Keep variant prop, though we override the default gradient
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
  children?: React.ReactNode; // Ensure children is accepted
}
const GlowingEffect = memo(
  ({
    blur = 0,
    inactiveZone = 0.7,
    proximity = 0,
    spread = 20,
    variant = "default", // variant prop still exists if needed elsewhere
    glow = false,
    className,
    movementDuration = 2,
    borderWidth = 1,
    disabled = true,
    children, // Accept children
  }: GlowingEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPosition = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>(0);

    const handleMove = useCallback(
      (e?: MouseEvent | { x: number; y: number }) => {
        if (!containerRef.current) return;

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
          const element = containerRef.current;
          if (!element) return;

          const { left, top, width, height } = element.getBoundingClientRect();
          const mouseX = e?.x ?? lastPosition.current.x;
          const mouseY = e?.y ?? lastPosition.current.y;

          if (e) {
            lastPosition.current = { x: mouseX, y: mouseY };
          }

          const center = [left + width * 0.5, top + height * 0.5];
          const distanceFromCenter = Math.hypot(
            mouseX - center[0],
            mouseY - center[1]
          );
          const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;

          if (distanceFromCenter < inactiveRadius) {
            element.style.setProperty("--active", "0");
            return;
          }

          const isActive =
            mouseX > left - proximity &&
            mouseX < left + width + proximity &&
            mouseY > top - proximity &&
            mouseY < top + height + proximity;

          element.style.setProperty("--active", isActive ? "1" : "0");

          if (!isActive) return;

          const currentAngle =
            parseFloat(element.style.getPropertyValue("--start")) || 0;
          let targetAngle =
            (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) /
              Math.PI +
            90;

          const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
          const newAngle = currentAngle + angleDiff;

          animate(currentAngle, newAngle, {
            duration: movementDuration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (value) => {
              element.style.setProperty("--start", String(value));
            },
          });
        });
      },
      [inactiveZone, proximity, movementDuration]
    );

    useEffect(() => {
      if (disabled) return;

      const handleScroll = () => handleMove();
      const handlePointerMove = (e: PointerEvent) => handleMove(e);

      window.addEventListener("scroll", handleScroll, { passive: true });
      document.body.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        window.removeEventListener("scroll", handleScroll);
        document.body.removeEventListener("pointermove", handlePointerMove);
      };
    }, [handleMove, disabled]);

    // --- Define the new gradient ---
    const newGradient = `
      radial-gradient(circle, cyan 10%, #00ffff00 20%),
      radial-gradient(circle at 40% 40%, hotpink 5%, #ff69b400 15%),
      radial-gradient(circle at 60% 60%, blue 10%, #0000ff00 20%),
      radial-gradient(circle at 40% 60%, violet 10%, #ee82ee00 20%),
      repeating-conic-gradient(
        from calc(var(--start) * 1deg), /* Use --start variable here */
        cyan 0%,
        hotpink calc(25% / var(--repeating-conic-gradient-times)),
        blue calc(50% / var(--repeating-conic-gradient-times)),
        violet calc(75% / var(--repeating-conic-gradient-times)),
        cyan calc(100% / var(--repeating-conic-gradient-times))
      )
    `;

    // White variant gradient (optional, kept as is)
    const whiteGradient = `repeating-conic-gradient(
      from 236.84deg at 50% 50%,
      var(--black),
      var(--black) calc(25% / var(--repeating-conic-gradient-times))
    )`;

    return (
      // Use a wrapper div that will have the border-radius and receive the ref
      // Render children *inside* this wrapper
      <div
          ref={containerRef} // Move ref here
          className={cn(
              "relative rounded-[inherit]", // Inherit radius from parent where GlowingEffect is used
              className // Allow passing additional classes to the main wrapper
          )}
          style={
              {
                  "--blur": `${blur}px`,
                  "--spread": spread,
                  "--start": "0", // Initial start angle
                  "--active": "0", // Initial active state
                  "--glowingeffect-border-width": `${borderWidth}px`,
                  "--repeating-conic-gradient-times": "5", // Or make this a prop
                  "--gradient": variant === "white" ? whiteGradient : newGradient, // Use the new gradient
              } as React.CSSProperties
          }
      >
          {/* Effect rendering divs - positioned absolutely within the wrapper */}
          <div
              className={cn(
                  "pointer-events-none absolute -inset-px rounded-[inherit] border opacity-0 transition-opacity",
                  glow && "opacity-100", // This border is mainly for the 'glow' prop visual state
                  variant === "white" ? "border-white" : "border-transparent", // Use transparent for default to avoid doubling border
                  disabled && "!block opacity-100" // Show a static border if disabled
              )}
              // Simple border if effect is disabled
              style={ disabled ? { borderColor: 'hsl(var(--border))', borderWidth: 'var(--glowingeffect-border-width)' } : {}}
          />
          <div
              className={cn(
                  "pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity",
                  glow && "opacity-100",
                  blur > 0 && "blur-[var(--blur)] ",
                  // className applied to wrapper now
                  disabled && "!hidden" // Hide the dynamic effect if disabled
              )}
          >
              <div
                  className={cn(
                      "glow", // Keep this class if needed for targeting
                      "h-full w-full rounded-[inherit]", // Ensure it fills the container and inherits radius
                      'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]',
                      "after:[border:var(--glowingeffect-border-width)_solid_transparent]",
                      "after:[background:var(--gradient)] after:[background-attachment:fixed]",
                      "after:opacity-[var(--active)] after:transition-opacity after:duration-300",
                      "after:[mask-clip:padding-box,border-box]", // Clip mask to border
                      "after:[mask-composite:intersect]",
                      "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]"
                  )}
              />
          </div>
          {/* Render children inside the main wrapper */}
          {children}
      </div>
    );
  }
);

GlowingEffect.displayName = "GlowingEffect";

export { GlowingEffect };