"use client"

import { type DashboardTable } from "@/app/dashboard/_components/dashboard-column";
import { getDriftOptimizerStats } from "./contract";
import { AnchorProvider } from "@coral-xyz/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PaystreamV1Program } from "@meimfhd/paystream-v1";

export async function getStats(paystreamProgram: PaystreamV1Program) {
  const optimizerStats = await getDriftOptimizerStats(paystreamProgram);

  return [
    { title: "Supply Volume", value: "Not available in testnet"},
    { title: "Borrow Volume", value: "$ " + optimizerStats.borrowVolume.toFixed(2).toString() },
    { title: "Match Rate", value: "Not available in testnet" },
    { title: "Available Liquidity", value: "$ " + optimizerStats.availableLiquidity.toFixed(2).toString() },
  ];
}

export async function getTableData() {
  return [
    {
      id: "1",
      asset: "sol" as const,
      balance: 200,
      avl_liquidity: 200,
      borrow_apr: 3.8,
      supply_apr: 9.1,
      p2p_apr: 8.4,
    },
    {
      id: "2",
      asset: "usdc" as const,
      balance: 100,
      avl_liquidity: 100,
      borrow_apr: 4.6,
      supply_apr: 10.01,
      p2p_apr: 7.36,
    },
  ];
}

export async function getDashboardTableData() {
  return [
    {
      id: "1",
      asset: "sol" as const,
      position: "100",
      type: "borrow",
      apy: "8.4",
    },
    {
      id: "2",
      asset: "usdc" as const,
      position: "200",
      type: "lend",
      apy: "7.36",
    },
  ] as DashboardTable[];
}
