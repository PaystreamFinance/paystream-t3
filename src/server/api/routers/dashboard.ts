import { PaystreamV1Program } from "@meimfhd/paystream-v1";
import { z } from "zod";

import { type DashboardTable } from "@/app/dashboard/_components/dashboard-column";
import { DECIMALS, SOL_HEADER_INDEX, USDC_HEADER_INDEX } from "@/constants";
import {
  getLendingPosition,
  getP2PBorrowPosition,
  getP2PLendingPosition,
  type Position,
} from "@/lib/contract";
import { createProvider, POSITION_TYPE_MAP } from "@/lib/utils";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const dashboardRouter = createTRPCRouter({
  getTableData: publicProcedure
    .input(
      z.object({
        publicKey: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { publicKey: address } = input;
      const provider = createProvider();
      const paystreamProgram = new PaystreamV1Program(provider);

      const marketHeaderData = await paystreamProgram.getAllMarketHeaders();
      const solMarket = marketHeaderData[SOL_HEADER_INDEX];
      const usdcMarket = marketHeaderData[USDC_HEADER_INDEX];

      if (!usdcMarket || !solMarket) {
        throw new Error("Markets not found");
      }

      // get market data for both markets
      const [usdcMarketDataFull, solMarketDataFull] = await Promise.all([
        paystreamProgram.getMarketDataUI(usdcMarket.market, usdcMarket.mint),
        paystreamProgram.getMarketDataUI(solMarket.market, solMarket.mint),
      ]);

      const usdcMarketData = usdcMarketDataFull.traders.find(
        (trader) => trader.address === address,
      );
      const solMarketData = solMarketDataFull.traders.find(
        (trader) => trader.address === address,
      );

      const positions: Position[] = [];

      // fn to add positions for a given asset
      const addPositionsForAsset = (
        marketData: any,
        asset: "SOL" | "USDC",
        decimals: number,
      ) => {
        if (!marketData) return;

        const positionTypes = [
          { type: "lending", getPosition: getLendingPosition },
          { type: "p2pLending", getPosition: getP2PLendingPosition },
          { type: "borrows", getPosition: getP2PBorrowPosition },
        ] as const;

        positionTypes.forEach(({ type, getPosition }) => {
          positions.push({
            asset,
            type,
            apy: null,
            positionData: getPosition(marketData, decimals),
          });
        });
      };

      addPositionsForAsset(usdcMarketData, "USDC", DECIMALS.USDC);
      addPositionsForAsset(solMarketData, "SOL", DECIMALS.SOL);

      // filter positions with positive amounts and transform to table data
      if (positions.length > 0) {
        return positions
          .filter((pos) => Number(pos.positionData.amount) > 0)
          .map((pos, idx) => ({
            id: idx.toString(),
            asset: pos.asset.toLowerCase() as "usdc" | "sol",
            position: pos.positionData.amount.toFixed(2),
            type: POSITION_TYPE_MAP[pos.type] as "LEND" | "P2P LEND" | "BORROW",
            apy: pos.apy?.toString() ?? "N/A",
            action_amount: pos.positionData.action_amount,
          })) as DashboardTable[];
      }

      return [];
    }),
});
