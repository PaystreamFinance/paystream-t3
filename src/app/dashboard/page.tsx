"use client";

import { NextPage } from "next";
import React, { useEffect } from "react";

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

  const { publicKey, connected } = useWallet();
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const provider = new AnchorProvider(connection, wallet!, {
    commitment: "processed",
  });
  const paystreamProgram = new PaystreamV1Program(provider);

  useEffect(() => {
    const fetchTraderPositions = async () => {
      if (!connected || !publicKey) return;

      setLoading(true);

      const positions = await getTraderPositions(
        paystreamProgram,
        publicKey.toBase58(),
      );

      const matches = await getP2PMatches(
        paystreamProgram,
        publicKey.toBase58(),
      );

      // Convert positions to table data format
      const tableData = positions
        .filter((pos) => Number(pos.positionData.amount) > 0)
        .map((pos, idx) => ({
          id: idx.toString(),
          asset: pos.asset.toLowerCase() as "usdc" | "sol",
          position: pos.positionData.amount.toFixed(2).toString(),
          type: (pos.type === "lending"
            ? "LEND"
            : pos.type === "p2pLending"
              ? "P2P LEND"
              : "BORROW") as "LEND" | "P2P LEND" | "BORROW",
          apy: pos.apy?.toString() ?? "N/A",
          action_amount: pos.positionData.action_amount,
        }));

      setTableData(tableData);

      setLoading(false);
    };

    fetchTraderPositions();
  }, [connected, publicKey]);

  return (
    <MaxWidthWrapper>
      <main className="relative flex w-full flex-col items-center justify-center border-x border-b border-border-t3 pt-12">
        <div className="mb-5 flex h-full w-full items-center justify-between gap-3 px-3 text-start sm:px-[56px]">
          <h3 className="w-fit font-darkerGrotesque text-4xl leading-[0.8] text-white">
            Dashboard
          </h3>

          <div>
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
            <StatsTable columns={dashboardColumn} data={tableData} />
          )}
        </div>
      </main>
    </MaxWidthWrapper>
  );
};

export default DashboardPage;
