"use client";

import { type DashboardTable } from "@/app/dashboard/_components/dashboard-column";
import { AnchorProvider, BN } from "@coral-xyz/anchor";
import {
  MarketDataUI,
  MarketPriceData,
  PaystreamMetrics,
  PaystreamV1Program,
  ProtocolMetrics,
} from "@meimfhd/paystream-v1";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { bnToNumber, getDriftOptimizerStats } from "./contract";
import { SOL_HEADER_INDEX, USDC_HEADER_INDEX } from "@/constants";

export function getDriftStats(
  usdcMarketData: MarketDataUI,
  solMarketData: MarketDataUI,
  priceData: MarketPriceData,
) {
  const optimizerStats = getDriftOptimizerStats(
    usdcMarketData,
    solMarketData,
    priceData,
  );

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
export function getStats() {
  return [
    { title: "Supply Volume", value: "Not available in testnet" },
    { title: "Borrow Volume", value: "Not available in testnet" },
    { title: "Match Rate", value: "Not available in testnet" },
    { title: "Available Liquidity", value: "Not available in testnet" },
  ];
}

export function getTableData(
  usdcMarketData: MarketDataUI,
  solMarketData: MarketDataUI,
  priceData: MarketPriceData,
  usdcProtocolMetrics: PaystreamMetrics<"drift">,
  solProtocolMetrics: PaystreamMetrics<"drift">,
) {
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
      supply_volume: bnToNumber(solProtocolMetrics.totalDepositsOnVault, 6),
      no_of_token: totalSupplySOL.toFixed(2),
      avl_liquidity: avaialableLiqSOL.toFixed(2),
      avl_liquidity_usd: (avaialableLiqSOL * solPrice).toFixed(2),
      borrow_apr: bnToNumber(solProtocolMetrics.protocolMetrics.borrowRate, 4),
      supply_apr: bnToNumber(solProtocolMetrics.protocolMetrics.depositRate, 4),
      p2p_apr: bnToNumber(solProtocolMetrics.midRateApy, 4),
    },
    {
      id: "2",
      asset: "usdc" as const,
      deposit_volume: bnToNumber(usdcProtocolMetrics.totalDepositsOnVault, 6),
      supply_volume: bnToNumber(usdcProtocolMetrics.totalDepositsOnVault, 6),
      no_of_token: totalSupplyUSDC.toFixed(2),
      avl_liquidity: avaialableLiqUSDC.toFixed(2),
      avl_liquidity_usd: avaialableLiqUSDC.toFixed(2),
      borrow_apr: bnToNumber(usdcProtocolMetrics.protocolMetrics.borrowRate, 4),
      supply_apr: bnToNumber(
        usdcProtocolMetrics.protocolMetrics.depositRate,
        4,
      ),
      p2p_apr: bnToNumber(usdcProtocolMetrics.midRateApy, 4),
    },
  ];
}

export function getDashboardTableData() {
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
