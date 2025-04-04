import { z } from "zod";

import { AnchorProvider, type Wallet } from "@coral-xyz/anchor";
import { PaystreamV1Program } from "@meimfhd/paystream-v1";
import { Connection } from "@solana/web3.js";

import { type OptimizerTable } from "@/components/optimizer-page/drift/table-columns";
import { SOL_HEADER_INDEX, USDC_HEADER_INDEX } from "@/constants";
import { bnToNumber, OptimizerStats } from "@/lib/contract";
import { logger } from "@/lib/utils";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const drfitRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getOptimizerStats: publicProcedure.query(async ({ ctx }) => {
    const connection = new Connection(process.env.RPC_URL!);

    const provider = new AnchorProvider(connection, {} as Wallet, {
      commitment: "processed",
    });

    const paystreamProgram = new PaystreamV1Program(provider);

    const marketHeaderData = await paystreamProgram.getAllMarketHeaders();

    const solMarket = marketHeaderData[SOL_HEADER_INDEX];
    const usdcMarket = marketHeaderData[USDC_HEADER_INDEX];

    if (!usdcMarket || !solMarket) {
      throw new Error("Markets not found");
    }

    // Get SOL price for conversion
    // const solPrice = await getSolanaPrice();
    const solPrice = 100;

    const usdcMarketData = await paystreamProgram.getMarketDataUI(
      usdcMarket.market,
      usdcMarket.mint,
    );

    const solMarketData = await paystreamProgram.getMarketDataUI(
      solMarket.market,
      solMarket.mint,
    );

    // Calculate borrow metrics
    const totalBorrowsUSDCP2p = bnToNumber(
      usdcMarketData.stats.borrows.totalBorrowedP2p,
      6,
    );
    const totalBorrowsSOLP2p = bnToNumber(
      solMarketData.stats.borrows.totalBorrowedP2p,
      9,
    );

    const totalBorrowsUSDCP2pUnmatched = bnToNumber(
      usdcMarketData.stats.borrows.borrowAmountUnmatched,
      6,
    );
    const totalBorrowsSOLP2pUnmatched = bnToNumber(
      solMarketData.stats.borrows.borrowAmountUnmatched,
      9,
    );

    /**
     * @description available for lending in both markets
     */
    const totalLendAmountUnmatched =
      bnToNumber(usdcMarketData.stats.deposits.lendAmountUnmatched, 6) +
      bnToNumber(solMarketData.stats.deposits.lendAmountUnmatched, 9) *
        solPrice;

    const totalBorrowsUSDC = totalBorrowsUSDCP2p + totalBorrowsUSDCP2pUnmatched;
    const totalBorrowsSOL = totalBorrowsSOLP2p + totalBorrowsSOLP2pUnmatched;

    // Calculate supply metrics
    const totalSupplyUSDC = bnToNumber(
      usdcMarketData.stats.deposits.totalSupply,
      6,
    );
    const totalSupplySOL = bnToNumber(
      solMarketData.stats.deposits.totalSupply,
      9,
    );

    const totalCollateralUSDC = bnToNumber(
      usdcMarketData.stats.deposits.collateral,
      6,
    );
    const totalCollateralSOL = bnToNumber(
      solMarketData.stats.deposits.collateral,
      9,
    );

    // Calculate aggregated metrics
    const totalCollateral = totalCollateralUSDC + totalCollateralSOL * solPrice;
    const borrowVolume = totalBorrowsUSDC + totalBorrowsSOL * solPrice;
    const supplyVolume = totalSupplyUSDC + totalSupplySOL * solPrice;
    const totalAmountInP2p =
      bnToNumber(usdcMarketData.stats.totalAmountInP2p, 6) +
      bnToNumber(solMarketData.stats.totalAmountInP2p, 9) * solPrice;

    const totalLendingVolume = supplyVolume - totalCollateral;
    const matchRate =
      totalAmountInP2p > 0 && totalLendAmountUnmatched > 0
        ? (totalAmountInP2p / totalLendAmountUnmatched) * 100
        : 0;

    logger.info(`Match rate: ${matchRate}`);
    logger.info(`Total lending volume: ${totalLendingVolume}`);
    logger.info(`Total amount in P2P: ${totalAmountInP2p}`);
    logger.info(`Total lend amount unmatched: ${totalLendAmountUnmatched}`);

    const availableLiquidity =
      bnToNumber(usdcMarketData.stats.totalLiquidityAvailable, 6) +
      bnToNumber(solMarketData.stats.totalLiquidityAvailable, 9) * solPrice;

    const optimizerStats: OptimizerStats = {
      borrowVolume,
      availableLiquidity,
      supplyVolume,
      matchRate,
    };

    return optimizerStats;
  }),
  getTableData: publicProcedure.query(async ({ ctx }) => {
    const connection = new Connection(process.env.RPC_URL!);

    const provider = new AnchorProvider(connection, {} as Wallet, {
      commitment: "processed",
    });

    const paystreamProgram = new PaystreamV1Program(provider);

    const marketHeaderData = await paystreamProgram.getAllMarketHeaders();
    const solMarket = marketHeaderData[SOL_HEADER_INDEX];
    const usdcMarket = marketHeaderData[USDC_HEADER_INDEX];

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
        balance: supplyVolumSOL.toFixed(2),
        noOfToken: totalSupplySOL.toFixed(2),
        avl_liquidity: avaialableLiqSOL.toFixed(2),
        avl_liquidity_usd: (avaialableLiqSOL * solPrice).toFixed(2),
        borrow_apr: 3.8,
        supply_apr: 9.1,
        p2p_apr: 8.4,
      },
      {
        id: "2",
        asset: "usdc" as const,
        balance: totalSupplyUSDC.toFixed(2),
        noOfToken: totalSupplyUSDC.toFixed(2),
        avl_liquidity: avaialableLiqUSDC.toFixed(2),
        avl_liquidity_usd: avaialableLiqUSDC.toFixed(2),
        borrow_apr: 4.6,
        supply_apr: 10.01,
        p2p_apr: 7.36,
      },
    ] as unknown as OptimizerTable[];
  }),
});
