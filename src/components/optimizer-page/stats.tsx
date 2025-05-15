"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function Stats({
  stats,
  underline = false,
}: {
  stats?: { title: string; value: string }[];
  underline?: boolean;
}) {
  const isMobile = useIsMobile();

  if (!stats) {
    throw new Error("Stats is required");
  }

  if (stats.length > 4) {
    throw new Error("Stats must be less than 4");
  }

  console.log("[LOGGGG] stats", stats);

  return (
    <div
      className={cn(
        "w-full border border-border-t3 sm:grid",
        isMobile ? "grid-cols-2" : "grid-cols-4",
      )}
    >
      {stats?.map((stat, index) => (
        <div
          key={index}
          className={cn(
            "flex items-start justify-between px-3 py-3 sm:flex-col sm:justify-center sm:px-4 sm:py-4 md:px-5 md:py-5 lg:px-7 lg:py-6",
            // Add borders based on position
            index % (isMobile ? 2 : 4) !== (isMobile ? 1 : 3) &&
              "border-r border-border-t3",
            // Add bottom borders to all cells except those in the last row
            Math.floor(index / (isMobile ? 2 : 4)) <
              Math.floor((stats.length - 1) / (isMobile ? 2 : 4)) &&
              "border-b border-border-t3",
          )}
        >
          <span
            className={cn(
              "font-darkerGrotesque text-[20px] text-[#BCEBFF]/50 sm:text-sm md:text-base lg:text-lg",
              underline && "underline decoration-dotted",
            )}
          >
            {stat.title}
          </span>
          <span
            className={cn(
              "font-darkerGrotesque text-[32px] font-thin text-white sm:text-lg md:text-lg lg:text-3xl",
              {
                "!text-lg md:!text-xl": stat.value
                  .toLowerCase()
                  .includes("not"),
              },
            )}
          >
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}
