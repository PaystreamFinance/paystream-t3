"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Loader } from "lucide-react";
import { NextPage } from "next";
import dynamic from "next/dynamic";

import MaxWidthWrapper from "@/components/max-width-wrapper";
import { StatsTable } from "@/components/optimizer-page/drift/stats-table";
import { api } from "@/trpc/react";

import { dashboardColumn } from "./_components/dashboard-column";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton,
    ),
  { ssr: false },
);

const DashboardPage: NextPage = () => {
  const { publicKey } = useWallet();

  if (!publicKey) {
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
            <p className="mt-6 flex w-full items-center justify-center gap-2 text-white">
              Please connect your wallet to view the dashboard.
            </p>
          </div>
        </main>
      </MaxWidthWrapper>
    );
  }

  const { data: tableData, isPending } = api.dashboard.getTableData.useQuery({
    publicKey: publicKey.toBase58(),
  });

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
          {isPending ? (
            <p className="mt-6 flex w-full items-center justify-center gap-2 text-white">
              <Loader className="size-4 animate-spin text-[#67DFFF]" /> loading
              table data...
            </p>
          ) : (
            <StatsTable columns={dashboardColumn} data={tableData ?? []} />
          )}
        </div>
      </main>
    </MaxWidthWrapper>
  );
};

export default DashboardPage;
