"use client";

import { type DashboardTable } from "@/app/dashboard/_components/dashboard-column";
import { AnchorProvider, BN } from "@coral-xyz/anchor";
import {
  type MarketDataUI,
  type MarketPriceData,
  type PaystreamMetrics,
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
  solProtocolMetrics: PaystreamMetrics<"drift">,
) {
  const optimizerStats = getDriftOptimizerStats(
    usdcMarketData,
    solMarketData,
    priceData,
    solProtocolMetrics,
  );

  return [
    {
      title: "Supply Volume",
      value: "$ " + Number(optimizerStats.supplyVolume.toFixed(4)).toString(),
    },
    {
      title: "Borrow Volume",
      value: "$ " + Number(optimizerStats.borrowVolume.toFixed(4)).toString(),
    },
    {
      title: "Match Rate",
      value: Number(optimizerStats.matchRate.toFixed(4)).toString() + " %",
    },
    {
      title: "Available Liquidity",
      value:
        "$ " +
        Number(optimizerStats.availableLiquidityInUSD.toFixed(4)).toString(),
    },
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
      supply_volume_usd: Number(
        solMarketData.stats.deposits.totalSupplyInUSD.toFixed(4),
      ).toString(),
      supply_volume: Number(
        solMarketData.stats.deposits.totalSupply.toNumber() / 10 ** 9,
      )
        .toFixed(4)
        .toString(),
      no_of_token: Number(totalSupplySOL.toFixed(4)).toString(),
      avl_liquidity: Number(
        solMarketData.stats.totalLiquidityAvailable.toNumber() / 10 ** 9,
      )
        .toFixed(4)
        .toString(),

      avl_liquidity_usd: Number(
        solMarketData.stats.totalLiquidityAvailableInUSD.toFixed(4),
      ).toString(),
      borrow_apr: bnToNumber(solProtocolMetrics.protocolMetrics.borrowRate, 4),
      supply_apr: bnToNumber(solProtocolMetrics.protocolMetrics.depositRate, 4),
      p2p_apr: bnToNumber(solProtocolMetrics.midRateApy, 4),
    },
    {
      id: "2",
      asset: "usdc" as const,
      supply_volume_usd: Number(
        usdcMarketData.stats.deposits.totalSupplyInUSD.toFixed(4),
      ).toString(),

      supply_volume: Number(
        usdcMarketData.stats.deposits.totalSupply.toNumber() / 10 ** 6,
      )
        .toFixed(4)
        .toString(),
      no_of_token: Number(totalSupplyUSDC.toFixed(4)).toString(),

      avl_liquidity: Number(
        usdcMarketData.stats.totalLiquidityAvailable.toNumber() / 10 ** 6,
      )
        .toFixed(4)
        .toString(),

      avl_liquidity_usd: Number(
        usdcMarketData.stats.totalLiquidityAvailableInUSD.toFixed(4),
      ).toString(),
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
  return [] as DashboardTable[];
}
