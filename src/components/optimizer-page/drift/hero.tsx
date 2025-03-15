import DriftBanner from "./drift-banner";
import Stats from "../stats";
import { StatsTable } from "./stats-table";
import { getStats, getTableData } from "@/lib/data";
import { columns } from "./table-columns";
export default async function DriftHero() {
  const stats = await getStats();
  const tableData = await getTableData(10);

  return (
    <main className="relative flex min-h-[1064px] w-full flex-col items-center justify-center border-x border-b border-border-t3">
      <div className="relative w-full gap-4 overflow-hidden px-[46px] pt-[30px]">
        <div className="relative h-[138px] w-full p-[1px]">
          <div className="absolute inset-0 z-0 bg-[linear-gradient(-45deg,#67DFFF,#844DFF,#C689B2,#F5DF9D)]" />
          <div className="relative z-10 flex h-full w-full items-center justify-start bg-bg-t3 p-[30px]">
            {/* <div className="pointer-events-none absolute inset-0 select-none">
              <Image
                src="/optimizers/driftbanner.svg"
                alt="Drift Banner"
                fill
                loading="eager"
                className="object-cover"
              />
            </div> */}

            <DriftBanner />
            {/* Content */}
            <div className="flex flex-col gap-4">
              <h3 className="font-darkerGrotesque text-4xl text-white">
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
      <div className="relative w-full px-[46px] py-[30px]">
        <Stats stats={stats} underline />
      </div>
      <div className="relative min-h-[616px] w-full px-[56px] pb-[30px]">
        <StatsTable columns={columns} data={tableData} />
      </div>
    </main>
  );
}
