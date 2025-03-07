"use client";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Stats() {
  const isMobile = useIsMobile();

  const stats = [
    { title: "Total Supply", value: "$102.3k" },
    { title: "Total Borrow", value: "$102.3k" },
    { title: "Matched Volume", value: "$102.3k" },
    { title: "Available Liquidity", value: "$102.3k" },
  ];

  return (
    <div
      className={cn(
        "grid w-full border border-border-t3",
        isMobile ? "grid-cols-2" : "grid-cols-4",
      )}
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className={cn(
            "flex flex-col items-start justify-center px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5 lg:px-7 lg:py-6",
            // Add borders based on position
            index % (isMobile ? 2 : 4) !== (isMobile ? 1 : 3) &&
              "border-r border-border-t3",
            // Add bottom borders to all cells except those in the last row
            Math.floor(index / (isMobile ? 2 : 4)) <
              Math.floor((stats.length - 1) / (isMobile ? 2 : 4)) &&
              "border-b border-border-t3",
          )}
        >
          <span className="font-darkerGrotesque text-xs text-[#BCEBFF80] sm:text-sm md:text-base lg:text-lg">
            {stat.title}
          </span>
          <span className="font-darkerGrotesque text-lg font-thin text-white sm:text-xl md:text-2xl lg:text-3xl">
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}
