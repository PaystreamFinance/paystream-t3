import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

export type OptimizerVariant = "drift" | "kamino" | "save" | "marginfi";

type OptimizerCardProps = {
  variant?: OptimizerVariant;
  className?: string;
};

export default function OptimizersCard({
  variant = "drift",
  className,
}: OptimizerCardProps) {
  const gradients = {
    drift: {
      colors: ["#67DFFF", "#844DFF", "#C689B2", "#F5DF9D", "#67DFFF"],
      bg: "bg-[linear-gradient(-45deg,#67DFFF,#844DFF,#C689B2,#F5DF9D)]",
    },
    kamino: {
      colors: ["#45A6DE", "#0D2039"],
      bg: "bg-[linear-gradient(-45deg,#45A6DE,#0D2039)]",
    },
    save: {
      colors: ["#FB5724", "#08043D"],
      bg: "bg-[linear-gradient(-45deg,#FB5724,#08043D)]",
    },
    marginfi: {
      colors: ["#DAE85F", "#0B0F0E"],
      bg: "bg-[linear-gradient(-45deg,#DAE85F,#0B0F0E)]",
    },
  };

  const cardData = {
    drift: {
      title: "Drift",
      description:
        "An optimised gateway to Drift Trade with the same liquidity and risk parameters.",
      suppliedVolume: "132.32k",
      apyImprovement: "100%",
    },
    kamino: {
      title: "Kamino",
      description:
        "An optimised gateway to Kamino with the same liquidity and risk parameters.",
      suppliedVolume: "132.32k",
      apyImprovement: "100%",
    },
    save: {
      title: "Save",
      description:
        "An optimised gateway to Save with the same liquidity and risk parameters.",
      suppliedVolume: "132.32k",
      apyImprovement: "0%",
    },
    marginfi: {
      title: "Marginfi",
      description:
        "An optimised gateway to Marginfi with the same liquidity and risk parameters.",
      suppliedVolume: "132.32k",
      apyImprovement: "100%",
    },
  };

  const selectedGradient = gradients[variant];

  return (
    <div
      className={cn(
        "group relative h-[192px] w-[474px] overflow-hidden p-[1px]",
        className,
      )}
    >
      {/* Animated gradient border */}
      <div className={cn("absolute inset-0 z-0", selectedGradient.bg)} />

      {/* Card content with background */}
      <div className={cn("relative z-10 h-full w-full bg-bg-t3")}>
        {/* Inner gradient overlay with 20% opacity */}
        <div
          className={cn(
            "absolute inset-0 opacity-10 backdrop-blur-lg",
            selectedGradient.bg,
          )}
        />

        {/* Content */}
        <div className="relative z-10 flex h-full w-full flex-col items-start gap-6 p-8">
          <div className="absolute right-8 top-8">
            <Image
              src="/arrow-right-up.svg"
              alt="Arrow up right"
              width={15}
              height={15}
              className="opacity-40 transition-all duration-300 group-hover:-rotate-180 group-hover:scale-110 group-hover:opacity-100"
            />
          </div>
          <div className="flex max-w-[340px] flex-col gap-4">
            <h3 className="font-darkerGrotesque text-2xl font-medium">
              {cardData[variant].title} Optimizer
            </h3>
            <p className="font-darkerGrotesque text-sm font-normal leading-[1] text-white/40">
              {cardData[variant].description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-darkerGrotesque inline-block whitespace-nowrap rounded-full bg-white/10 px-4 py-1 text-[16px] font-normal leading-none">
              Supplied Volume - ${cardData[variant].suppliedVolume}
            </span>
            <span className="font-darkerGrotesque inline-block whitespace-nowrap rounded-full bg-white/10 px-4 py-1 text-[16px] font-normal leading-none">
              APY Improvement - {cardData[variant].apyImprovement}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
