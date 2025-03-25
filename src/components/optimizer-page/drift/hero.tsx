import { getStats, getTableData } from "@/lib/data";

import Stats from "../stats";
import DriftBanner from "./drift-banner";
import { StatsTable } from "./stats-table";
import { columns } from "./table-columns";

export default async function DriftHero() {
  const stats = await getStats();
  const tableData = await getTableData();

  return (
    <main className="relative flex min-h-[1064px] w-full flex-col items-center justify-center border-x border-b border-border-t3">
      <div className="relative w-full gap-4 overflow-hidden px-3 pt-[30px] sm:px-[46px]">
        <div className="relative mx-auto h-[300px] w-full max-w-[300px] p-[1px] md:h-[141px] md:w-full md:max-w-none">
          <div className="absolute inset-0 z-0 bg-[linear-gradient(-45deg,#67DFFF,#844DFF,#C689B2,#F5DF9D)]" />
          <div className="relative z-10 flex h-full w-full items-center justify-start bg-bg-t3 bg-[url('/drift/banner-sm.svg')] bg-no-repeat p-[30px] md:h-[138px] md:bg-[url('/drift/banner.svg')]">
            {/* <div className="pointer-events-none absolute inset-0 select-none">
              <Image
                src="/optimizers/driftbanner.svg"
                alt="Drift Banner"
                fill
                loading="eager"
                className="object-cover"
              />
            </div> */}

            {/* <DriftBanner /> */}
            {/* Content */}
            <div className="flex h-full flex-col gap-3">
              <h3 className="font-darkerGrotesque text-4xl leading-[0.8] text-white">
                Drift Optimizer
              </h3>
              <p className="max-w-[341px] font-darkerGrotesque text-[16px] font-normal leading-tight text-white/70">
                An optimized gateway to Drift Trade with the same liquidity and
                risk parameters.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full px-3 py-[30px] sm:px-[46px]">
        <Stats stats={stats} underline />
      </div>
      <div className="relative min-h-[616px] w-full px-3 pb-[30px] sm:px-[56px]">
        <StatsTable columns={columns} data={tableData} />
      </div>
    </main>
  );
}
