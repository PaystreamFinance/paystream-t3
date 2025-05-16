"use client";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { AnchorProvider } from "@coral-xyz/anchor";
import {
  MarketConfig,
  MarketDataUI,
  MarketPriceData,
  PaystreamMetrics,
  PaystreamV1Program,
} from "@meimfhd/paystream-v1";
import { useConnection } from "@solana/wallet-adapter-react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useMarketData } from "@/hooks/useMarketData";
import { getDriftOptimizerStats, type OptimizerStats } from "@/lib/contract";

export type OptimizerVariant = "drift" | "kamino" | "save" | "marginfi";

type OptimizerCardProps = {
  usdcMarketData: MarketDataUI | null;
  solMarketData: MarketDataUI | null;
  priceData: MarketPriceData | null;
  solProtocolMetrics: PaystreamMetrics<"drift"> | null;
  variant?: OptimizerVariant;
  className?: string;
  commingSoon?: boolean;
};

export default function OptimizersCard({
  usdcMarketData,
  solMarketData,
  priceData,
  solProtocolMetrics,
  variant = "drift",
  className,
  commingSoon,
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

  const [stats, setStats] = useState<OptimizerStats | null>(null);
  const router = useRouter();

  // Memoize the stats calculation to prevent unnecessary updates
  const calculateStats = useCallback(() => {
    if (!usdcMarketData || !solMarketData || !priceData || !solProtocolMetrics)
      return null;

    try {
      return getDriftOptimizerStats(
        usdcMarketData,
        solMarketData,
        priceData,
        solProtocolMetrics,
      );
    } catch (error) {
      console.error("Error calculating optimizer stats:", error);
      return null;
    }
  }, [usdcMarketData, solMarketData, priceData, solProtocolMetrics]);

  useEffect(() => {
    const newStats = calculateStats();
    if (newStats) {
      setStats(newStats);
    }
  }, [calculateStats]);

  const cardData = {
    drift: {
      title: "Drift",
      description:
        "An optimised gateway to Drift Trade with the same liquidity and risk parameters.",
      suppliedVolume: stats?.supplyVolume?.toFixed(4) || "--",
      apyImprovement: stats?.apyImprovement?.toString() + "%" || "--",
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
      onMouseDown={() => {
        if (cardData[variant].title === "Drift") {
          router.push(`/optimizers/${variant}`);
        } else {
          return;
        }
      }}
      className={cn(
        cardData[variant].title === "Drift"
          ? "cursor-pointer"
          : "cursor-not-allowed",
      )}
    >
      <div
        className={cn(
          "group relative h-[160px] w-full overflow-hidden p-[1px] sm:h-[150px] md:h-[170px] lg:h-[192px]",
          className,
        )}
      >
        {/* Gradient border */}
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

          {cardData[variant].title === "Drift" ? (
            // // Content
            <div className="relative z-10 flex h-full w-full flex-col items-start gap-4 p-4 sm:gap-3 sm:p-4 md:gap-4 md:p-6 lg:gap-6 lg:p-8">
              <div className="absolute right-3 top-3 sm:right-4 sm:top-4 md:right-6 md:top-6 lg:right-8 lg:top-8">
                <Image
                  src="/arrow-right-up.svg"
                  alt="Arrow up right"
                  width={15}
                  height={15}
                  className="opacity-40 transition-all duration-300 group-hover:opacity-100"
                />
              </div>
              <div className="flex max-w-full flex-col gap-3 sm:max-w-[280px] sm:gap-2 md:max-w-[320px] md:gap-3 lg:max-w-[340px] lg:gap-4">
                <h3 className="font-darkerGrotesque text-base font-medium sm:text-lg md:text-xl lg:text-2xl">
                  {cardData[variant].title} Optimizer
                </h3>
                <p className="font-darkerGrotesque text-xs font-normal leading-[1] text-white/40 sm:text-xs md:text-sm">
                  {cardData[variant].description}
                </p>
              </div>
              <div className="flex flex-wrap items-start gap-2 sm:gap-2 md:flex-row md:items-center md:gap-3">
                <span className="inline-block whitespace-nowrap rounded-full bg-white/10 px-2 py-1 font-darkerGrotesque text-xs font-normal leading-none sm:px-3 md:px-4 md:text-sm lg:text-[16px]">
                  Supplied Volume - ${cardData[variant].suppliedVolume}
                </span>
                <span className="inline-block whitespace-nowrap rounded-full bg-white/10 px-2 py-1 font-darkerGrotesque text-xs font-normal leading-none sm:px-3 md:px-4 md:text-sm lg:text-[16px]">
                  APY Improvement - {cardData[variant].apyImprovement}
                </span>
              </div>
            </div>
          ) : (
            <div className="relative z-10 flex h-full w-full flex-col items-start gap-4 p-4 sm:gap-3 sm:p-4 md:gap-4 md:p-6 lg:gap-6 lg:p-8">
              {/* <div className="absolute right-3 top-3 sm:right-4 sm:top-4 md:right-6 md:top-6 lg:right-8 lg:top-8">
                <Image
                  src="/arrow-right-up.svg"
                  alt="Arrow up right"
                  width={15}
                  height={15}
                  className="opacity-40 transition-all duration-300 group-hover:opacity-100"
                />
              </div> */}
              <div className="flex max-w-full flex-col gap-3 sm:max-w-[280px] sm:gap-2 md:max-w-[320px] md:gap-3 lg:max-w-[340px] lg:gap-4">
                <h3 className="font-darkerGrotesque text-base font-medium sm:text-lg md:text-xl lg:text-2xl">
                  {cardData[variant].title} Optimizer
                </h3>
                <p className="min-w-full font-darkerGrotesque text-xs font-normal leading-[1] text-white/40 sm:text-xs md:text-sm">
                  {cardData[variant].description}
                </p>
              </div>

              <div className="flex flex-wrap items-start gap-2 sm:gap-2 md:flex-row md:items-center md:gap-3">
                <span className="inline-block whitespace-nowrap rounded-full bg-white/10 px-2 py-1 font-darkerGrotesque text-xs font-normal leading-none sm:px-3 md:px-4 md:text-sm lg:text-[16px]">
                  Coming Soon
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
