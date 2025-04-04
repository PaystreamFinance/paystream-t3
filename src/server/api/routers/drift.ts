import {
  MarketHeaderWithPubkey,
  PaystreamV1Program,
} from "@meimfhd/paystream-v1";
import { type PublicKey } from "@solana/web3.js";
import { z } from "zod";

import { type OptimizerTable } from "@/components/optimizer-page/drift/table-columns";
import {
  APY_RATES,
  DECIMALS,
  SOL_HEADER_INDEX,
  SOL_PRICE,
  USDC_HEADER_INDEX,
} from "@/constants";
import { bnToNumber, type OptimizerStats } from "@/lib/contract";
import { createProvider, logger } from "@/lib/utils";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const driftRouter = createTRPCRouter({
  getUserData: publicProcedure
    .input(
      z.object({
        vaultTitle: z.enum(["SOL", "USDC"]),
        publicKey: z.custom<PublicKey>(),
      }),
    )
    .query(async ({ input }) => {
      const { vaultTitle, publicKey } = input;
      const provider = createProvider();
      const paystreamProgram = new PaystreamV1Program(provider);

      // get all market headers
      const headers = await paystreamProgram.getAllMarketHeaders();
      if (!headers) {
        logger.error("Market headers not found");
        throw new Error("Market headers not found");
      }

      // select appropriate market header based on vault title
      const headerIndex =
        vaultTitle === "SOL" ? SOL_HEADER_INDEX : USDC_HEADER_INDEX;
      const marketHeader = headers[headerIndex] ?? null;

      if (!marketHeader?.market) {
        logger.error(`${vaultTitle} market header not found`);
        throw new Error(`${vaultTitle} market header not found`);
      }

      const userData = await paystreamProgram.getTraderPosition(
        marketHeader?.market!,
        publicKey,
      );

      if (!userData) {
        logger.error("User data not found");
      }

      // calculate position metrics
      const decimals = DECIMALS[vaultTitle];
      const apy = APY_RATES[vaultTitle];
      const onVaultLendsNum =
        Number(userData?.onVaultLends?.toString() ?? "0") /
        Math.pow(10, decimals);

      return {
        myPositions: onVaultLendsNum.toFixed(2),
        apy: apy.toString(),
        projectedEarnings: (onVaultLendsNum * (1 + apy / 100)).toFixed(2),
      };
    }),

  getOptimizerStats: publicProcedure.query(async () => {
    const provider = createProvider();
    const paystreamProgram = new PaystreamV1Program(provider);

    // get market headers
    const marketHeaderData = await paystreamProgram.getAllMarketHeaders();
    const solMarket = marketHeaderData[SOL_HEADER_INDEX];
    const usdcMarket = marketHeaderData[USDC_HEADER_INDEX];

    if (!usdcMarket || !solMarket) {
      throw new Error("Markets not found");
    }

    // get market data for both markets
    const [usdcMarketData, solMarketData] = await Promise.all([
      paystreamProgram.getMarketDataUI(usdcMarket.market, usdcMarket.mint),
      paystreamProgram.getMarketDataUI(solMarket.market, solMarket.mint),
    ]);

    // calculate borrow metrics
    const metrics = {
      // USDC metrics (decimal 6)
      totalBorrowsUSDCP2p: bnToNumber(
        usdcMarketData.stats.borrows.totalBorrowedP2p,
        DECIMALS.USDC,
      ),
      totalBorrowsUSDCP2pUnmatched: bnToNumber(
        usdcMarketData.stats.borrows.borrowAmountUnmatched,
        DECIMALS.USDC,
      ),
      totalSupplyUSDC: bnToNumber(
        usdcMarketData.stats.deposits.totalSupply,
        DECIMALS.USDC,
      ),
      totalCollateralUSDC: bnToNumber(
        usdcMarketData.stats.deposits.collateral,
        DECIMALS.USDC,
      ),
      usdcLendAmountUnmatched: bnToNumber(
        usdcMarketData.stats.deposits.lendAmountUnmatched,
        DECIMALS.USDC,
      ),
      usdcAmountInP2p: bnToNumber(
        usdcMarketData.stats.totalAmountInP2p,
        DECIMALS.USDC,
      ),
      usdcLiquidityAvailable: bnToNumber(
        usdcMarketData.stats.totalLiquidityAvailable,
        DECIMALS.USDC,
      ),

      // SOL metrics (decimal 9)
      totalBorrowsSOLP2p: bnToNumber(
        solMarketData.stats.borrows.totalBorrowedP2p,
        DECIMALS.SOL,
      ),
      totalBorrowsSOLP2pUnmatched: bnToNumber(
        solMarketData.stats.borrows.borrowAmountUnmatched,
        DECIMALS.SOL,
      ),
      totalSupplySOL: bnToNumber(
        solMarketData.stats.deposits.totalSupply,
        DECIMALS.SOL,
      ),
      totalCollateralSOL: bnToNumber(
        solMarketData.stats.deposits.collateral,
        DECIMALS.SOL,
      ),
      solLendAmountUnmatched: bnToNumber(
        solMarketData.stats.deposits.lendAmountUnmatched,
        DECIMALS.SOL,
      ),
      solAmountInP2p: bnToNumber(
        solMarketData.stats.totalAmountInP2p,
        DECIMALS.SOL,
      ),
      solLiquidityAvailable: bnToNumber(
        solMarketData.stats.totalLiquidityAvailable,
        DECIMALS.SOL,
      ),
    };

    // calculate aggregated values in USD
    const totalBorrowsUSDC =
      metrics.totalBorrowsUSDCP2p + metrics.totalBorrowsUSDCP2pUnmatched;
    const totalBorrowsSOLInUSD =
      (metrics.totalBorrowsSOLP2p + metrics.totalBorrowsSOLP2pUnmatched) *
      SOL_PRICE;

    // calculate total metrics
    const totalCollateral =
      metrics.totalCollateralUSDC + metrics.totalCollateralSOL * SOL_PRICE;
    const borrowVolume = totalBorrowsUSDC + totalBorrowsSOLInUSD;
    const supplyVolume =
      metrics.totalSupplyUSDC + metrics.totalSupplySOL * SOL_PRICE;

    // P2P metrics
    const totalAmountInP2p =
      metrics.usdcAmountInP2p + metrics.solAmountInP2p * SOL_PRICE;
    const totalLendAmountUnmatched =
      metrics.usdcLendAmountUnmatched +
      metrics.solLendAmountUnmatched * SOL_PRICE;

    // calculate derived metrics
    const totalLendingVolume = supplyVolume - totalCollateral;
    const matchRate =
      totalLendAmountUnmatched > 0
        ? (totalAmountInP2p / totalLendAmountUnmatched) * 100
        : 0;

    logger.info(
      matchRate?.toString(),
      totalLendingVolume,
      totalAmountInP2p,
      totalLendAmountUnmatched,
    );

    const availableLiquidity =
      metrics.usdcLiquidityAvailable +
      metrics.solLiquidityAvailable * SOL_PRICE;

    return {
      borrowVolume,
      availableLiquidity,
      supplyVolume,
      matchRate,
    } as OptimizerStats;
  }),

  getTableData: publicProcedure.query(async () => {
    const provider = createProvider();
    const paystreamProgram = new PaystreamV1Program(provider);

    // get market headers
    const marketHeaderData = await paystreamProgram.getAllMarketHeaders();
    const solMarket = marketHeaderData[SOL_HEADER_INDEX];
    const usdcMarket = marketHeaderData[USDC_HEADER_INDEX];

    if (!usdcMarket || !solMarket) {
      logger.error("Markets not found");
      throw new Error("Markets not found");
    }

    // get market data for both markets
    const [usdcMarketData, solMarketData] = await Promise.all([
      paystreamProgram.getMarketDataUI(usdcMarket.market, usdcMarket.mint),
      paystreamProgram.getMarketDataUI(solMarket.market, solMarket.mint),
    ]);

    // calculate SOL metrics
    const totalSupplySOL = bnToNumber(
      solMarketData.stats.deposits.totalSupply,
      DECIMALS.SOL,
    );
    const supplyVolumeSOL = totalSupplySOL * SOL_PRICE;
    const availableLiqSOL = bnToNumber(
      solMarketData.stats.totalLiquidityAvailable,
      DECIMALS.SOL,
    );

    // calculate USDC metrics
    const totalSupplyUSDC = bnToNumber(
      usdcMarketData.stats.deposits.totalSupply,
      DECIMALS.USDC,
    );
    const availableLiqUSDC = bnToNumber(
      usdcMarketData.stats.totalLiquidityAvailable,
      DECIMALS.USDC,
    );

    const SOL_APR = {
      borrow: 3.8,
      supply: 9.1,
      p2p: 8.4,
    };

    const USDC_APR = {
      borrow: 4.6,
      supply: 10.01,
      p2p: 7.36,
    };

    return [
      {
        id: "1",
        asset: "sol" as const,
        balance: supplyVolumeSOL.toFixed(2),
        noOfToken: totalSupplySOL.toFixed(2),
        avl_liquidity: availableLiqSOL.toFixed(2),
        avl_liquidity_usd: (availableLiqSOL * SOL_PRICE).toFixed(2),
        borrow_apr: SOL_APR.borrow,
        supply_apr: SOL_APR.supply,
        p2p_apr: SOL_APR.p2p,
      },
      {
        id: "2",
        asset: "usdc" as const,
        balance: totalSupplyUSDC.toFixed(2),
        noOfToken: totalSupplyUSDC.toFixed(2),
        avl_liquidity: availableLiqUSDC.toFixed(2),
        avl_liquidity_usd: availableLiqUSDC.toFixed(2),
        borrow_apr: USDC_APR.borrow,
        supply_apr: USDC_APR.supply,
        p2p_apr: USDC_APR.p2p,
      },
    ] as unknown as OptimizerTable[];
  }),
});
