import { z } from "zod";

import { AnchorProvider, type Wallet } from "@coral-xyz/anchor";
import { PaystreamV1Program } from "@meimfhd/paystream-v1";
import { Connection } from "@solana/web3.js";

import { DashboardTable } from "@/app/dashboard/_components/dashboard-column";
import { SOL_HEADER_INDEX, USDC_HEADER_INDEX } from "@/constants";
import {
  getLendingPosition,
  getP2PBorrowPosition,
  getP2PLendingPosition,
  type Position,
} from "@/lib/contract";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const dashboardRouter = createTRPCRouter({
  getTableData: publicProcedure
    .input(
      z.object({
        publicKey: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const address = input.publicKey;

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

      const usdcMarketData = (
        await paystreamProgram.getMarketDataUI(
          usdcMarket.market,
          usdcMarket.mint,
        )
      ).traders.find((trader) => trader.address === address);
      const solMarketData = (
        await paystreamProgram.getMarketDataUI(solMarket.market, solMarket.mint)
      ).traders.find((trader) => trader.address === address);

      const positions: Position[] = [];

      if (usdcMarketData) {
        positions.push({
          asset: "USDC",
          type: "lending",
          apy: null,
          positionData: getLendingPosition(usdcMarketData, 6),
        });
        positions.push({
          asset: "USDC",
          type: "p2pLending",
          apy: null,
          positionData: getP2PLendingPosition(usdcMarketData, 6),
        });
        positions.push({
          asset: "USDC",
          type: "borrows",
          apy: null,
          positionData: getP2PBorrowPosition(usdcMarketData, 6),
        });
      }

      if (solMarketData) {
        positions.push({
          asset: "SOL",
          type: "lending",
          apy: null,
          positionData: getLendingPosition(solMarketData, 9),
        });
        positions.push({
          asset: "SOL",
          type: "p2pLending",
          apy: null,
          positionData: getP2PLendingPosition(solMarketData, 9),
        });
        positions.push({
          asset: "SOL",
          type: "borrows",
          apy: null,
          positionData: getP2PBorrowPosition(solMarketData, 9),
        });
      }

      if (positions.length > 0) {
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

        return tableData as DashboardTable[];
      }

      return [];
    }),
});
