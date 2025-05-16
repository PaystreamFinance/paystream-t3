"use client";

import { type NextPage } from "next";
import React, { useCallback, useEffect } from "react";

import { AnchorProvider } from "@coral-xyz/anchor";
import { PaystreamV1Program } from "@meimfhd/paystream-v1";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { Loader } from "lucide-react";
import dynamic from "next/dynamic";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import { StatsTable } from "@/components/optimizer-page/drift/stats-table";
import { getP2PMatches, getTraderPositions } from "@/lib/contract";

import {
  dashboardColumn,
  type DashboardTable,
} from "./_components/dashboard-column";
import OptimizersDropdown from "./_components/optimzers-dropdown";
import { useMarketData } from "@/hooks/useMarketData";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton,
    ),
  { ssr: false },
);

const DashboardPage: NextPage = () => {
  const [tableData, setTableData] = React.useState<DashboardTable[]>([]);
  const [loading, setLoading] = React.useState(false);
  const {
    usdcMarketData,
    solMarketData,
    loading: loadingMarketData,
    error,
    provider,
    usdcProtocolMetrics,
    solProtocolMetrics,
    refresh,
    setRefresh,
  } = useMarketData(
    new anchor.web3.PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
    new anchor.web3.PublicKey("So11111111111111111111111111111111111111112"),
    new anchor.web3.PublicKey("CCQXHfu51HEpiaegMU2kyYZK7dw1NhNbAX6cV44gZDJ8"),
    new anchor.web3.PublicKey("GSjnD3XA1ezr7Xew3PZKPJdKGhjWEGefFFxXJhsfrX5e"),
  );

  const fetchTraderPositions = useCallback(async () => {
    // Don't proceed if we're already loading or if there's an error
    if (loading || error) {
      console.log("Loading", loading, "Error", error);
      return;
    }

    // Don't proceed if we don't have all required data
    if (
      !provider ||
      !usdcMarketData ||
      !solMarketData ||
      !usdcProtocolMetrics ||
      !solProtocolMetrics
    )
      return;

    try {
      setLoading(true);

      const positions = getTraderPositions(
        provider.wallet.publicKey.toBase58(),
        usdcMarketData,
        solMarketData,
        usdcProtocolMetrics,
        solProtocolMetrics,
      );
      console.log("positions", positions);
      console.log("usdcMarketData", usdcMarketData);

      const matches = getP2PMatches(
        provider.wallet.publicKey.toBase58(),
        usdcMarketData,
        solMarketData,
      );

      // Convert positions to table data format
      const tableData: DashboardTable[] = positions
        .filter((pos) => pos.positionData !== null)
        .map((pos, idx) => ({
          id: idx.toString(),
          asset: pos.asset,
          position: Number(pos.positionData!.amount.toFixed(4)).toString(),
          type: pos.type,
          apy: pos.apy?.toString() ?? "--",
          action_amount: pos.positionData!.amount,
          amount_in_usd: pos.positionData!.amountInUSD,
          onSuccess: () => setRefresh(!refresh),
        }));
      console.log("tableData", tableData);
      setTableData(tableData);
    } catch (error) {
      console.error("Error fetching trader positions:", error);
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    error,
    provider,
    usdcMarketData,
    solMarketData,
    usdcProtocolMetrics,
    solProtocolMetrics,
    refresh,
    setRefresh,
  ]);

  useEffect(() => {
    // Only fetch if we have the required data and we're not in a loading state
    if (
      !loadingMarketData &&
      provider &&
      usdcMarketData &&
      solMarketData &&
      !loading
    ) {
      fetchTraderPositions();
    }
  }, [
    provider,
    usdcMarketData,
    solMarketData,
    error,
    loadingMarketData,
    loading,
    usdcProtocolMetrics,
    solProtocolMetrics,
    fetchTraderPositions,
  ]); // Only re-run when these core dependencies change

  return (
    <MaxWidthWrapper>
      <main className="relative flex w-full flex-col items-center justify-center border-x border-b border-border-t3 pt-12">
        <div className="mb-5 flex h-full w-full items-center justify-between gap-3 px-3 text-start sm:px-[56px]">
          <h3 className="w-fit font-darkerGrotesque text-4xl leading-[0.8] text-white">
            Dashboard
          </h3>

          <div className="flex items-center gap-2">
            <OptimizersDropdown />
            <WalletMultiButton
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
            />
          </div>
        </div>

        <div className="relative min-h-[616px] w-full px-3 pb-[30px] sm:px-[56px]">
          {loading ? (
            <p className="mt-6 flex w-full items-center justify-center gap-2 text-white">
              <Loader className="size-4 animate-spin text-[#67DFFF]" /> loading
              table data...
            </p>
          ) : (
            <StatsTable
              loading={loading}
              columns={dashboardColumn}
              data={tableData}
            />
          )}
        </div>
      </main>
    </MaxWidthWrapper>
  );
};

export default DashboardPage;
