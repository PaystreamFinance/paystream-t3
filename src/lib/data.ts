"use client";

import { type DashboardTable } from "@/app/dashboard/_components/dashboard-column";
import { AnchorProvider, BN } from "@coral-xyz/anchor";
import { PaystreamV1Program } from "@meimfhd/paystream-v1";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { bnToNumber, getDriftOptimizerStats } from "./contract";

export async function getDriftStats(paystreamProgram: PaystreamV1Program) {
  const optimizerStats = await getDriftOptimizerStats(paystreamProgram);

  return [
    {
      title: "Supply Volume",
      value: "$ " + optimizerStats.supplyVolume.toFixed(2).toString(),
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

export async function getTableData(paystreamProgram: PaystreamV1Program) {
  const marketHeaderData = await paystreamProgram.getAllMarketHeaders();
  const usdcMarket = marketHeaderData[0];
  const solMarket = marketHeaderData[1];

  console.log(marketHeaderData, "marketHeaderData");

  if (!usdcMarket || !solMarket) {
    throw new Error("Market not found");
  }

  const usdcMarketData = await paystreamProgram.getMarketDataUI(
    usdcMarket.market,
    usdcMarket.mint,
  );

  const solMarketData = await paystreamProgram.getMarketDataUI(
    solMarket.market,
    solMarket.mint,
  );

  const totalSupplyUSDC = bnToNumber(
    usdcMarketData.stats.deposits.totalSupply,
    6,
  );
  const totalSupplySOL = bnToNumber(
    solMarketData.stats.deposits.totalSupply,
    9,
  );

  // const solPrice = await getSolanaPrice();
  const solPrice = 100;

  const supplyVolumSOL = totalSupplySOL * solPrice;

  const avaialableLiqSOL = bnToNumber(
    solMarketData.stats.totalLiquidityAvailable,
    9,
  );

  const avaialableLiqUSDC = bnToNumber(
    usdcMarketData.stats.totalLiquidityAvailable,
    6,
  );

  return [
    {
      id: "1",
      asset: "sol" as const,
      balance: supplyVolumSOL,
      noOfToken: totalSupplySOL,
      avl_liquidity: avaialableLiqSOL,
      borrow_apr: 3.8,
      supply_apr: 9.1,
      p2p_apr: 8.4,
    },
    {
      id: "2",
      asset: "usdc" as const,
      balance: totalSupplyUSDC,
      noOfToken: totalSupplyUSDC,
      avl_liquidity: avaialableLiqUSDC,
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
