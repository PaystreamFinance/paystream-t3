"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

import { AnchorProvider } from "@coral-xyz/anchor";
import { PaystreamV1Program } from "@meimfhd/paystream-v1";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import Carousel from "./carousel";

import { Loader } from "lucide-react";
import Stats from "./stats";
import { getDriftStats, getTableData } from "@/lib/data";
import { useMarketData } from "@/hooks/useMarketData";
import { PublicKey } from "@solana/web3.js";

const Hero: React.FC = () => {
  const [stats, setStats] = useState<{ title: string; value: string }[]>([]);

  const [tableData, setTableData] = useState<any>(undefined);

  const {
    usdcMarketData,
    solMarketData,
    priceData,
    loading,
    error,
    paystreamProgram,
    provider,
    usdcProtocolMetrics,
    solProtocolMetrics,
  } = useMarketData(
    new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
    new PublicKey("So11111111111111111111111111111111111111112"),
    new PublicKey("CCQXHfu51HEpiaegMU2kyYZK7dw1NhNbAX6cV44gZDJ8"),
    new PublicKey("GSjnD3XA1ezr7Xew3PZKPJdKGhjWEGefFFxXJhsfrX5e"),
  );
  useEffect(() => {
    async function fetchStats() {
      if (!usdcMarketData || !solMarketData || !priceData || !solProtocolMetrics || !usdcProtocolMetrics) return;
      const stats = getDriftStats(usdcMarketData, solMarketData, priceData, solProtocolMetrics);
      setStats(stats);

      const tableData = getTableData(
        usdcMarketData,
        solMarketData,
        priceData,
        usdcProtocolMetrics,
        solProtocolMetrics,
      );
      setTableData(tableData);
    }
    fetchStats();
  }, [usdcMarketData, solMarketData, priceData, solProtocolMetrics, usdcProtocolMetrics]);

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

          <Carousel
            usdcMarketData={usdcMarketData}
            solMarketData={solMarketData}
            priceData={priceData}
            solProtocolMetrics={solProtocolMetrics}
          />
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
