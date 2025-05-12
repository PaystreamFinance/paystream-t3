"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

import { AnchorProvider } from "@coral-xyz/anchor";
import { PaystreamV1Program } from "@meimfhd/paystream-v1";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { getStats } from "@/lib/data";
import Carousel from "./carousel";

import { Loader } from "lucide-react";
import Stats from "./stats";
import { getDriftStats, getTableData } from "@/lib/data";
import { StatsTable } from "./drift/stats-table";
import { columns } from "./drift/table-columns";

const Hero: React.FC = () => {
  const [stats, setStats] = useState<{ title: string; value: string }[]>([]);

  const [tableData, setTableData] = useState<any>(undefined);

  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const provider = new AnchorProvider(connection, wallet!, {
    commitment: "processed",
  });
  const paystreamProgram = new PaystreamV1Program(provider);

  useEffect(() => {
    async function fetchStats() {
      const data = await getStats();
      setStats(data);
    }
    fetchStats();
  }, []);

  useEffect(() => {
    async function fetchStats() {
      const stats = await getDriftStats(paystreamProgram);
      setStats(stats);

      const tableData = await getTableData(paystreamProgram);
      setTableData(tableData);
    }
    fetchStats();
  }, []);

  return (
    <>
      <main className="relative flex min-h-[500px] w-full flex-col items-start justify-between border-x border-border-t3 px-6 text-white sm:min-h-[600px] sm:px-0 md:min-h-[700px] lg:min-h-[842px]">
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-6 sm:mt-12 sm:gap-8 md:mt-16 md:gap-10 lg:mt-20 lg:gap-[60px]">
          <h1 className="mb-8 text-center text-3xl font-thin leading-[1.1] text-[#EAEAEA] sm:mb-0 sm:text-4xl md:text-5xl lg:text-[64px]">
            Choose your <br />
            <span className="font-ibmPlexSerif font-normal italic">
              optimizer
            </span>
          </h1>

          {/* Stats for mobile view */}
          <div className="mb-8 w-full md:hidden">
            <Stats stats={stats} />
          </div>

          <Carousel />
        </div>

        {/* Stats for desktop view */}
        {/* <div className="hidden w-full md:block">
          <Stats stats={stats} />
        </div> */}
        <div className="hidden w-full md:block">
          {!stats ? (
            <p className="mt-6 flex w-full items-center justify-center gap-2 text-white">
              <Loader className="size-4 animate-spin text-[#67DFFF]" /> loading
              stats...
            </p>
          ) : (
            <Stats stats={stats} />
          )}
        </div>
      </main>
    </>
  );
};

export default Hero;
