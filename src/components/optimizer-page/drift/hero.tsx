"use client";

import { AnchorProvider } from "@coral-xyz/anchor";
import { PaystreamV1Program } from "@meimfhd/paystream-v1";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { getDriftStats, getTableData } from "@/lib/data";

import { useMarketData } from "@/hooks/useMarketData";
import { PublicKey } from "@solana/web3.js";
import Stats from "../stats";
import { StatsTable } from "./stats-table";
import { columns } from "./table-columns";

export default function DriftHero() {
  const [stats, setStats] = useState<
    { title: string; value: string }[] | undefined
  >(undefined);

  const { connected } = useWallet();

  const [tableData, setTableData] = useState<any>(undefined);
  const {
    usdcMarketData,
    solMarketData,
    priceData,
    loading,
    error,
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
      if (!usdcMarketData || !solMarketData || !priceData || !solProtocolMetrics) return;

      const stats = getDriftStats(usdcMarketData, solMarketData, priceData, solProtocolMetrics);
      setStats(stats);
      console.log("USDC Stats", {
        totalAmountInP2p: usdcMarketData.stats.totalAmountInP2p.toString(),
        totalAmountInP2pInUSD:
          usdcMarketData.stats.totalAmountInP2pInUSD.toString(),
        totalLiquidityAvailable:
          usdcMarketData.stats.totalLiquidityAvailable.toString(),
        totalLiquidityAvailableInUSD:
          usdcMarketData.stats.totalLiquidityAvailableInUSD.toString(),
        deposits: {
          totalSupply: usdcMarketData.stats.deposits.totalSupply.toString(),
          totalSupplyInUSD:
            usdcMarketData.stats.deposits.totalSupplyInUSD.toString(),
          lendAmountUnmatched:
            usdcMarketData.stats.deposits.lendAmountUnmatched.toString(),
          lendAmountUnmatchedInUSD:
            usdcMarketData.stats.deposits.lendAmountUnmatchedInUSD.toString(),
          collateral: usdcMarketData.stats.deposits.collateral.toString(),
          collateralInUSD:
            usdcMarketData.stats.deposits.collateralInUSD.toString(),
        },
        borrows: {
          totalBorrowedP2p:
            usdcMarketData.stats.borrows.totalBorrowedP2p.toString(),
          totalBorrowedP2pInUSD:
            usdcMarketData.stats.borrows.totalBorrowedP2pInUSD.toString(),
          borrowAmountUnmatched:
            usdcMarketData.stats.borrows.borrowAmountUnmatched.toString(),
          borrowAmountUnmatchedInUSD:
            usdcMarketData.stats.borrows.borrowAmountUnmatchedInUSD.toString(),
          utilizationRate: usdcMarketData.stats.borrows.utilizationRate,
        },
        traders: {
          count: usdcMarketData.stats.traders.count,
          activeCount: usdcMarketData.stats.traders.activeCount,
        },
      });
      console.log("SOL Stats", {
        totalAmountInP2p: solMarketData.stats.totalAmountInP2p.toString(),
        totalAmountInP2pInUSD:
          solMarketData.stats.totalAmountInP2pInUSD.toString(),
        totalLiquidityAvailable:
          solMarketData.stats.totalLiquidityAvailable.toString(),
        totalLiquidityAvailableInUSD:
          solMarketData.stats.totalLiquidityAvailableInUSD.toString(),
        deposits: {
          totalSupply: solMarketData.stats.deposits.totalSupply.toString(),
          totalSupplyInUSD:
            solMarketData.stats.deposits.totalSupplyInUSD.toString(),
          lendAmountUnmatched:
            solMarketData.stats.deposits.lendAmountUnmatched.toString(),
          lendAmountUnmatchedInUSD:
            solMarketData.stats.deposits.lendAmountUnmatchedInUSD.toString(),
          collateral: solMarketData.stats.deposits.collateral.toString(),
          collateralInUSD:
            solMarketData.stats.deposits.collateralInUSD.toString(),
        },
        borrows: {
          totalBorrowedP2p:
            solMarketData.stats.borrows.totalBorrowedP2p.toString(),
          totalBorrowedP2pInUSD:
            solMarketData.stats.borrows.totalBorrowedP2pInUSD.toString(),
          borrowAmountUnmatched:
            solMarketData.stats.borrows.borrowAmountUnmatched.toString(),
          borrowAmountUnmatchedInUSD:
            solMarketData.stats.borrows.borrowAmountUnmatchedInUSD.toString(),
          utilizationRate: solMarketData.stats.borrows.utilizationRate,
        },
        traders: {
          count: solMarketData.stats.traders.count,
          activeCount: solMarketData.stats.traders.activeCount,
        },
      });
      console.log("stats", stats);
      console.log("stats", stats);
      console.log(
        "usdcMarketData",
        usdcMarketData.traders.map((trader) => {
          return {
            borrowPending: trader.borrowing.borrowPending.toString(),
            borrowPendingInUSD: trader.borrowing.borrowPendingInUSD.toString(),
            p2pBorrowed: trader.borrowing.p2pBorrowed.toString(),
            p2pBorrowedInUSD: trader.borrowing.p2pBorrowedInUSD.toString(),
            deposit: trader.lending.onVaultLends.toString(),
            depositInUSD: trader.lending.onVaultLendsInUSD.toString(),
            collateral: trader.lending.collateral.amount.toString(),
            collateralInUSD: trader.lending.collateral.amountInUSD.toString(),
            p2pLend: trader.lending.p2pLends.toString(),
            p2pLendInUSD: trader.lending.p2pLendsInUsdValue.toString(),
            maxBorrowAmount: trader.lending.collateral.amount.toString(),
            maxBorrowAmountInUSD:
              trader.lending.collateral.amountInUSD.toString(),
          };
        }),
      );
      console.log(
        "solMarketData",
        solMarketData.traders.map((trader) => {
          return {
            borrowPending: trader.borrowing.borrowPending.toString(),
            borrowPendingInUSD: trader.borrowing.borrowPendingInUSD.toString(),
            p2pBorrowed: trader.borrowing.p2pBorrowed.toString(),
            p2pBorrowedInUSD: trader.borrowing.p2pBorrowedInUSD.toString(),
            deposit: trader.lending.onVaultLends.toString(),
            depositInUSD: trader.lending.onVaultLendsInUSD.toString(),
            collateral: trader.lending.collateral.amount.toString(),
            collateralInUSD: trader.lending.collateral.amountInUSD.toString(),
            p2pLend: trader.lending.p2pLends.toString(),
            p2pLendInUSD: trader.lending.p2pLendsInUsdValue.toString(),
            maxBorrowAmount: trader.lending.collateral.amount.toString(),
            maxBorrowAmountInUSD:
              trader.lending.collateral.amountInUSD.toString(),
          };
        }),
      );
      const tableData = getTableData(
        usdcMarketData,
        solMarketData,
        priceData,
        usdcProtocolMetrics!,
        solProtocolMetrics!,
      );
      setTableData(tableData);
      console.log("tableData", tableData);
    }
    if (!loading && !error && usdcMarketData && solMarketData && priceData) {
      fetchStats();
    }
  }, [loading, error, usdcMarketData, solMarketData, priceData]);

  if (!connected) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-white">Please connect your wallet</p>
      </div>
    );
  }

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
          <StatsTable
            loading={loading}
            columns={columns}
            data={tableData}
          />
        )}
      </div>
    </main>
  );
}
