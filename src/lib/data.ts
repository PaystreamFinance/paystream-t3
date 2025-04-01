"use client";

import { type DashboardTable } from "@/app/dashboard/_components/dashboard-column";
import { AnchorProvider, BN } from "@coral-xyz/anchor";
import { PaystreamV1Program } from "@meimfhd/paystream-v1";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { getDriftOptimizerStats } from "./contract";

export async function getDriftStats(paystreamProgram: PaystreamV1Program) {
  const optimizerStats = await getDriftOptimizerStats(paystreamProgram);

  return [
    {
      title: "Supply Volume",
      value: optimizerStats.supplyVolume.toFixed(2).toString(),
    },
    {
      title: "Borrow Volume",
      value: "$ " + optimizerStats.borrowVolume.toFixed(2).toString(),
    },
    {
      title: "Match Rate",
      value: optimizerStats.matchRate.toFixed(2).toString() + " %",
    },
    {
      title: "Available Liquidity",
      value: "$ " + optimizerStats.availableLiquidity.toFixed(2).toString(),
    },
  ];
}
export async function getStats() {
  return [
    { title: "Supply Volume", value: "Not available in testnet" },
    { title: "Borrow Volume", value: "Not available in testnet" },
    { title: "Match Rate", value: "Not available in testnet" },
    { title: "Available Liquidity", value: "Not available in testnet" },
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
      type: "BORROW" as const,
      apy: "8.4",
      action_amount: new BN(1000000000),
    },
    {
      id: "2",
      asset: "usdc" as const,
      position: "200",
      type: "LEND" as const,
      apy: "7.36",
      action_amount: new BN(200000000),
    },
  ] as DashboardTable[];
}
