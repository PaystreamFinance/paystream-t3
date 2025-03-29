import { NextPage } from "next";
import React from "react";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import { StatsTable } from "@/components/optimizer-page/drift/stats-table";
import { getDashboardTableData, getStats } from "@/lib/data";

import {
  dashboardColumn,
  type DashboardTable,
} from "./_components/dashboard-column";

const DashboardPage: NextPage = async () => {
  const tableData: DashboardTable[] = await getDashboardTableData();

  return (
    <MaxWidthWrapper>
      <main className="relative flex w-full flex-col items-center justify-center border-x border-b border-border-t3 pt-12">
        <div className="mb-5 flex h-full w-full flex-col items-start justify-start gap-3 px-3 text-start sm:px-[56px]">
          <h3 className="w-fit font-darkerGrotesque text-4xl leading-[0.8] text-white">
            Dashboard
          </h3>
        </div>

        <div className="relative min-h-[616px] w-full px-3 pb-[30px] sm:px-[56px]">
          <StatsTable columns={dashboardColumn} data={tableData} />
        </div>
      </main>
    </MaxWidthWrapper>
  );
};

export default DashboardPage;
