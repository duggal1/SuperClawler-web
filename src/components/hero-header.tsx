import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text"; 
import { ChevronRight } from "lucide-react";
import AnimationContainer from "./Contaniers/global-motion";

export function HeroHeader() {
  return (
    <AnimationContainer delay={0.0}>
    <div
      className={cn(
        "group relative inline-flex mt-16  items-center justify-center rounded-full",
        "border border-neutral-300 dark:border-neutral-700", // Static border, conditional color
        "px-4 py-1.5", // Padding inside the border
        "text-sm font-medium", // Base text style (AnimatedGradientText will override color)
        "transition-all duration-300 ease-in-out hover:scale-[1.02]" // Keep hover effect, added 'transition-all'
        // Removed background/shadow styles, relying on border now
      )}
    >
    
      {/* Content container - flex items */}
      <div className="flex items-center ">
        {/* AnimatedGradientText should apply its own gradient style to the text */}
        <AnimatedGradientText>
          <span className="mr-1.5 inline-block">🔥</span> {/* Optional icon */}
          Introducing SuperCrawler for Enterprises
        </AnimatedGradientText>

  
        <ChevronRight
          className={cn(
            "ml-1.5 size-4",
            "stroke-neutral-500 dark:stroke-neutral-400", // Chevron color remains consistent
            "transition-transform duration-200 ease-in-out group-hover:translate-x-0.5"
          )}
        />
      </div>
    </div>
    </AnimationContainer>
  );
}
