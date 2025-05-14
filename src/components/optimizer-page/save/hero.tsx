"use client";

import { AnchorProvider } from "@coral-xyz/anchor";
import { MarketDataUI, PaystreamV1Program } from "@meimfhd/paystream-v1";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { getDriftStats, getTableData } from "@/lib/data";

import Stats from "../stats";
import { StatsTable } from "./stats-table";
import { columns } from "./table-columns";
import { PublicKey } from "@solana/web3.js";
import { useMarketData } from "@/hooks/useMarketData";

export default function SaveHero() {
  const [stats, setStats] = useState<
    { title: string; value: string }[] | undefined
  >(undefined);
  const [tableData, setTableData] = useState<any>(undefined);
  // const {
  //   usdcMarketData,
  //   solMarketData,
  //   priceData,
  //   loading,
  //   error,
  //   paystreamProgram,
  //   provider,
  // } = useMarketData(
  //   new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
  //   new PublicKey("So11111111111111111111111111111111111111112"),
  //   new PublicKey("79f7C4TQ4hV3o8tjq1DJ4d5EnDGcnNApZ8mESti6oCt2"),
  //   new PublicKey("E2kejpm5EmsKZVjB5Ge2YmjsjiwfWE4rfhqPhLZZ7TRd"),
  // );

  // useEffect(() => {
  //   async function fetchStats() {
  //     if (!usdcMarketData || !solMarketData || !priceData) return;
  //   }

  //   if (!loading && !error && usdcMarketData && solMarketData && priceData) {
  //     fetchStats();
  //   }
  // }, [loading, error, usdcMarketData, solMarketData, priceData]);

  return (
    <main className="relative flex min-h-[1064px] w-full flex-col items-center justify-center border-x border-b border-border-t3">
      <div className="relative w-full gap-4 overflow-hidden px-3 pt-[30px] sm:px-[46px]">
        <div className="relative mx-auto h-[300px] w-full max-w-[300px] p-[1px] md:h-[141px] md:w-full md:max-w-none">
          <div className="absolute inset-0 z-0 bg-[linear-gradient(-45deg,#FB5724,#08043D)]" />
          <div className="relative z-10 flex h-full w-full items-center justify-start bg-bg-t3 bg-no-repeat p-[30px] md:h-[138px]">
            <div className="absolute inset-0 bg-[linear-gradient(-45deg,#FB5724,#08043D)] opacity-20"></div>
            {/* <div className="pointer-events-none absolute inset-0 select-none">
              <Image
                src="/optimizers/save/banner.svg"
                alt="Save Banner"
                fill
                loading="eager"
                className="object-cover"
              />
            </div> */}

            {/* <DriftBanner /> */}
            {/* Content */}
            <div className="flex h-full flex-col gap-3">
              <h3 className="font-darkerGrotesque text-4xl leading-[0.8] text-white">
                Save Optimizer
              </h3>
              <p className="max-w-[341px] font-darkerGrotesque text-[16px] font-normal leading-tight text-white/70">
                An optimized gateway to Save with the same liquidity and risk
                risk parameters.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full px-3 py-[30px] sm:px-[46px]">
        {!stats ? (
          <p className="mt-6 flex w-full items-center justify-center gap-2 text-white">
            <Loader className="size-4 animate-spin text-[#67DFFF]" /> loading
            stats...
          </p>
        ) : (
          <Stats stats={stats} />
        )}
      </div>

      <div className="mb-5 flex w-full items-center justify-end px-3 sm:px-[46px]">
        <Link href="/dashboard">
          <Button
            className="group flex items-center gap-2"
            style={{
              backgroundColor: "#02142B",
              color: "#BCEBFF",
              border: "1px solid #9CE0FF",
              borderRadius: "8px",
              padding: "0 24px",
              fontSize: "12px",
              height: "34px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              whiteSpace: "nowrap",
              transition: "colors",
              fontWeight: "normal",
              cursor: "pointer",
            }}
          >
            Dashboard
          </Button>
        </Link>
      </div>

      <div className="relative min-h-[616px] w-full px-3 pb-[30px] sm:px-[56px]">
        {!tableData ? (
          <p className="mt-6 flex w-full items-center justify-center gap-2 text-white">
            <Loader className="size-4 animate-spin text-[#67DFFF]" /> loading
            table data...
          </p>
        ) : (
          <StatsTable columns={columns} data={tableData} />
        )}
      </div>
    </main>
  );
}
