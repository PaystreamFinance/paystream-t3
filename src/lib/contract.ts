import {
  SOL_HEADER_INDEX,
  SOL_MINT,
  USDC_HEADER_INDEX,
  USDC_MINT,
} from "@/constants";
import { BN } from "@coral-xyz/anchor";
import { PaystreamV1Program, TraderPositionUI } from "@meimfhd/paystream-v1";
import { PublicKey } from "@solana/web3.js";

// Simple logger with levels
const logger = {
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
  info: (message: string, ...args: any[]) => {
    console.info(`[INFO] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
};

export interface Position {
  asset: "SOL" | "USDC";
  type: "lending" | "p2pLending" | "borrows";
  apy: number | null;
  positionData: PositionData;
}

export async function getTraderPositions(
  paystreamProgram: PaystreamV1Program,
  address: string,
) {
  try {
    const marketHeaderData = await paystreamProgram.getAllMarketHeaders();
    const solMarket = marketHeaderData[SOL_HEADER_INDEX];
    const usdcMarket = marketHeaderData[USDC_HEADER_INDEX];

    if (!usdcMarket || !solMarket) {
      throw new Error("Markets not found");
    }

    const usdcMarketData = (
      await paystreamProgram.getMarketDataUI(usdcMarket.market, usdcMarket.mint)
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

    return positions;
  } catch (error) {
    logger.error("Error getting trader positions:", error);
    throw error;
  }
}

export interface MatchData {
  lender: string;
  borrower: string;
  asset: "SOL" | "USDC";
  amount: number;
  timestamp: Date;
  durationInDays: number;
  id: number;
}

export async function getP2PMatches(
  paystreamProgram: PaystreamV1Program,
  lenderAddress: string,
): Promise<MatchData[]> {
  try {
    const marketHeaderData = await paystreamProgram.getAllMarketHeaders();
    const solMarket = marketHeaderData[SOL_HEADER_INDEX];
    const usdcMarket = marketHeaderData[USDC_HEADER_INDEX];

    if (!usdcMarket || !solMarket) {
      throw new Error("Markets not found");
    }

    const matches: MatchData[] = [];

    // Get USDC market matches
    const usdcMarketData = await paystreamProgram.getMarketDataUI(
      usdcMarket.market,
      usdcMarket.mint,
    );

    // Get SOL market matches
    const solMarketData = await paystreamProgram.getMarketDataUI(
      solMarket.market,
      solMarket.mint,
    );

    // Process USDC matches
    usdcMarketData.matches
      .filter((match) => match.lender === lenderAddress)
      .forEach((match) => {
        matches.push({
          lender: match.lender,
          borrower: match.borrower,
          asset: "USDC",
          amount: bnToNumber(match.amount, 6),
          timestamp: match.timestamp,
          durationInDays: match.durationInDays,
          id: match.id,
        });
      });

    // Process SOL matches
    solMarketData.matches
      .filter((match) => match.lender === lenderAddress)
      .forEach((match) => {
        matches.push({
          lender: match.lender,
          borrower: match.borrower,
          asset: "SOL",
          amount: bnToNumber(match.amount, 9),
          timestamp: match.timestamp,
          durationInDays: match.durationInDays,
          id: match.id,
        });
      });

    return matches;
  } catch (error) {
    logger.error("Error getting P2P matches:", error);
    throw error;
  }
}

export interface OptimizerStats {
  borrowVolume: number;
  availableLiquidity: number;
  supplyVolume: number;
  matchRate: number;
}

export async function getDriftOptimizerStats(
  paystreamProgram: PaystreamV1Program,
) {
  try {
    const marketHeaderData = await paystreamProgram.getAllMarketHeaders();
    const solMarket = marketHeaderData[SOL_HEADER_INDEX];
    const usdcMarket = marketHeaderData[USDC_HEADER_INDEX];

    if (!usdcMarket || !solMarket) {
      throw new Error("Markets not found");
    }

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

    // Get SOL price for conversion
    const solPrice = await getSolanaPrice();

    // Calculate aggregated metrics
    const totalCollateral = totalCollateralUSDC + totalCollateralSOL * solPrice;
    const borrowVolume = totalBorrowsUSDC + totalBorrowsSOL * solPrice;
    const supplyVolume = totalSupplyUSDC + totalSupplySOL * solPrice;
    const totalAmountInP2p =
      bnToNumber(usdcMarketData.stats.totalAmountInP2p, 6) +
      bnToNumber(solMarketData.stats.totalAmountInP2p, 9) * solPrice;

    const totalLendingVolume = supplyVolume - totalCollateral;
    const matchRate =
      totalLendingVolume > 0
        ? (totalAmountInP2p / totalLendingVolume) * 100
        : 0;

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
  } catch (error) {
    logger.error("Error getting drift optimizer stats:", error);
    throw error;
  }
}

async function getSolanaPrice(): Promise<number> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.solana || !data.solana.usd) {
      throw new Error("Invalid response format from price API");
    }

    return data.solana.usd;
  } catch (error) {
    logger.error("Error fetching Solana price:", error);
    // Return a default fallback price
    return 0;
  }
}

interface PositionData {
  amount: number;
  action_amount: BN;
}

function getLendingPosition(
  traderPosition: TraderPositionUI,
  decimals: number,
): PositionData {
  return {
    amount: bnToNumber(traderPosition.lending.deposits, decimals),
    action_amount:
      traderPosition.lending.deposits -
      traderPosition.lending.collateral.amount,
  };
}

function getP2PLendingPosition(
  traderPosition: TraderPositionUI,
  decimals: number,
): PositionData {
  return {
    amount: bnToNumber(traderPosition.lending.p2pLends, decimals),
    action_amount: traderPosition.lending.p2pLends,
  };
}

function getP2PBorrowPosition(
  traderPosition: TraderPositionUI,
  decimals: number,
): PositionData {
  return {
    amount: bnToNumber(traderPosition.borrowing.p2pBorrowed, decimals),
    action_amount: traderPosition.borrowing.p2pBorrowed,
  };
}

export const bnToNumber = (bn: BN, decimals: number = 9): number => {
  return Number(bn) / Math.pow(10, decimals);
};
