import { cn } from "@/lib/utils";

export default function StatsGrid({
  stats,
  underline = false,
}: {
  stats: {
    myPosition: string;
    apy: string;
    projectedEarnings: string;
  };
  underline?: boolean;
}) {
  return (
    <div className="grid w-full grid-rows-2 divide-y divide-border-t3 border border-border-t3">
      <div className="flex flex-col items-start justify-center gap-1 px-8 py-6">
        <span
          className={cn(
            "font-darkerGrotesque text-[20px] font-[500] text-[#BCEBFF80]",
            underline && "underline decoration-dotted",
          )}
        >
          My Position
        </span>
        <span className="font-darkerGrotesque text-[32px] font-[400] text-[#EAEAEA]">
          {stats.myPosition}
        </span>
      </div>
      <div className="grid w-full grid-cols-2 divide-x divide-border-t3">
        <div className="flex flex-col items-start justify-center gap-1 px-8 py-6">
          <span
            className={cn(
              "font-darkerGrotesque text-[20px] font-[500] text-[#BCEBFF80]",
              underline && "underline decoration-dotted",
            )}
          >
            APY
          </span>
          <span className="font-darkerGrotesque text-[32px] font-[400] text-[#EAEAEA]">
            {stats.apy}%
          </span>
        </div>
        <div className="flex flex-col items-start justify-center gap-1 px-8 py-6">
          <span
            className={cn(
              "font-darkerGrotesque text-[20px] font-[500] text-[#BCEBFF80]",
              underline && "underline decoration-dotted",
            )}
          >
            Projected Earnings
          </span>
          <span className="font-darkerGrotesque text-[32px] font-[400] text-[#EAEAEA]">
            {stats.projectedEarnings}
          </span>
        </div>
      </div>
    </div>
  );
}

export function StatsGridHorizontal({
  stats,
  underline = false,
}: {
  stats: {
    totalDeposits: string;
    liquidity: string;
    apy: string;
  };
  underline?: boolean;
}) {
  return (
    <div className="grid min-h-[129px] w-full grid-cols-3 divide-x divide-border-t3 border border-border-t3">
      <div className="flex flex-col items-start justify-center gap-1 px-8 py-6">
        <span
          className={cn(
            "font-darkerGrotesque text-[20px] font-[500] text-[#BCEBFF80]",
            underline && "underline decoration-dotted",
          )}
        >
          Total Deposits
        </span>
        <span className="font-darkerGrotesque text-lg font-[400] text-[#EAEAEA]">
          {stats.totalDeposits}
        </span>
      </div>
      <div className="flex flex-col items-start justify-center gap-1 px-8 py-6">
        <span
          className={cn(
            "font-darkerGrotesque text-[20px] font-[500] text-[#BCEBFF80]",
            underline && "underline decoration-dotted",
          )}
        >
          Liquidity
        </span>
        <span className="font-darkerGrotesque text-lg font-[400] text-[#EAEAEA]">
          {stats.liquidity}
        </span>
      </div>
      <div className="flex flex-col items-start justify-center gap-1 px-8 py-6">
        <span
          className={cn(
            "font-darkerGrotesque text-[20px] font-[500] text-[#BCEBFF80]",
            underline && "underline decoration-dotted",
          )}
        >
          Drift APY
        </span>
        <span className="font-darkerGrotesque text-lg font-[400] text-[#EAEAEA]">
          {stats.apy}%
        </span>
      </div>
    </div>
  );
}
