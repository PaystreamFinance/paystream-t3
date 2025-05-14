import { BN } from "@coral-xyz/anchor";
import {
  MarketDataUI,
  MarketPriceData,
  TraderPositionUI,
} from "@meimfhd/paystream-v1";
import { logger } from "./utils";

export interface Position {
  asset: "SOL" | "USDC";
  type: "lending" | "p2pLending" | "p2pBorrowing" | "pendingBorrowing";
  apy: number | null;
  positionData: PositionData;
}

export function getTraderPositions(
  address: string,
  usdcMarket: MarketDataUI,
  solMarket: MarketDataUI,
): Position[] {
  try {
    const usdcTrader = usdcMarket.traders.find(
      (trader) => trader.address === address,
    );

    const solTrader = solMarket.traders.find(
      (trader) => trader.address === address,
    );

    if (!usdcTrader && !solTrader) {
      return [];
    }

    const positions: Position[] = [];

    if (usdcMarket && usdcTrader) {
      positions.push({
        asset: "USDC",
        type: "lending",
        apy: null,
        positionData: getLendingPosition(usdcTrader, 6),
      });
      positions.push({
        asset: "USDC",
        type: "p2pLending",
        apy: null,
        positionData: getP2PLendingPosition(usdcTrader, 6),
      });
      positions.push({
        asset: "USDC",
        type: "p2pBorrowing",
        apy: null,
        positionData: getP2PBorrowPosition(usdcTrader, 6),
      });
      positions.push({
        asset: "USDC",
        type: "pendingBorrowing",
        apy: null,
        positionData: getPendingBorrowPosition(usdcTrader, 6),
      });
    }

    if (solMarket && solTrader) {
      positions.push({
        asset: "SOL",
        type: "lending",
        apy: null,
        positionData: getLendingPosition(solTrader, 9),
      });
      positions.push({
        asset: "SOL",
        type: "p2pLending",
        apy: null,
        positionData: getP2PLendingPosition(solTrader, 9),
      });
      positions.push({
        asset: "SOL",
        type: "p2pBorrowing",
        apy: null,
        positionData: getP2PBorrowPosition(solTrader, 9),
      });
      positions.push({
        asset: "SOL",
        type: "pendingBorrowing",
        apy: null,
        positionData: getPendingBorrowPosition(solTrader, 9),
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

export function getP2PMatches(
  address: string,
  usdcMarket: MarketDataUI,
  solMarket: MarketDataUI,
): MatchData[] {
  try {
    const usdcMatches = usdcMarket.matches.filter(
      (match) => match.lender === address || match.borrower === address,
    );

    const usdcMatchesData: MatchData[] = [];
    if (usdcMatches) {
      usdcMatches.forEach((match) => {
        usdcMatchesData.push({
          lender: match.lender,
          borrower: match.borrower,
          asset: "USDC",
          amount: bnToNumber(match.amount, 6),
          timestamp: match.timestamp,
          durationInDays: match.durationInDays,
          id: match.id,
        });
      });
    }

    // Process SOL matches
    const solMatches = solMarket.matches.filter(
      (match) => match.lender === address || match.borrower === address,
    );

    const solMatchesData: MatchData[] = [];

    if (solMatches) {
      solMatches.forEach((match) => {
        solMatchesData.push({
          lender: match.lender,
          borrower: match.borrower,
          asset: "SOL",
          amount: bnToNumber(match.amount, 9),
          timestamp: match.timestamp,
          durationInDays: match.durationInDays,
          id: match.id,
        });
      });
    }

    return [...usdcMatchesData, ...solMatchesData];
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

export function getDriftOptimizerStats(
  usdcMarket: MarketDataUI,
  solMarket: MarketDataUI,
  priceData: MarketPriceData,
): OptimizerStats {
  try {
    let usdcPrice: number;
    let solPrice: number;
    console.log(usdcMarket, solMarket);
    if (usdcMarket.marketId.toString() === "0") {
      usdcPrice = priceData.originalMarketPrice;
      solPrice = priceData.originalCollateralPrice;
    } else {
      usdcPrice = priceData.originalMarketPrice;
      solPrice = priceData.originalCollateralPrice;
    }
    // Calculate borrow metrics
    const totalBorrowsUSDCP2p = bnToNumber(
      usdcMarket.stats.borrows.totalBorrowedP2p,
      6,
    );
    const totalBorrowsSOLP2p = bnToNumber(
      solMarket.stats.borrows.totalBorrowedP2p,
      9,
    );

    const totalBorrowsUSDCP2pUnmatched = bnToNumber(
      usdcMarket.stats.borrows.borrowAmountUnmatched,
      6,
    );
    const totalBorrowsSOLP2pUnmatched = bnToNumber(
      solMarket.stats.borrows.borrowAmountUnmatched,
      9,
    );

    const totalLendAmountUnmatched =
      bnToNumber(usdcMarket.stats.deposits.lendAmountUnmatched, 6) +
      bnToNumber(solMarket.stats.deposits.lendAmountUnmatched, 9);

    const totalBorrowsUSDC = totalBorrowsUSDCP2p + totalBorrowsUSDCP2pUnmatched;
    const totalBorrowsSOL = totalBorrowsSOLP2p + totalBorrowsSOLP2pUnmatched;

    // Calculate supply metrics
    const totalSupplyUSDC = bnToNumber(
      usdcMarket.stats.deposits.totalSupply,
      6,
    );
    const totalSupplySOL = bnToNumber(solMarket.stats.deposits.totalSupply, 9);

    const totalCollateralUSDC = bnToNumber(
      usdcMarket.stats.deposits.collateral,
      6,
    );
    const totalCollateralSOL = bnToNumber(
      solMarket.stats.deposits.collateral,
      9,
    );

    // Calculate aggregated metrics
    const totalCollateral = totalCollateralUSDC + totalCollateralSOL * solPrice;
    const borrowVolume = totalBorrowsUSDC + totalBorrowsSOL * solPrice;
    const supplyVolume = totalSupplyUSDC + totalSupplySOL * solPrice;
    const totalAmountInP2p =
      bnToNumber(usdcMarket.stats.totalAmountInP2p, 6) +
      bnToNumber(solMarket.stats.totalAmountInP2p, 9) * solPrice;

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
      bnToNumber(usdcMarket.stats.totalLiquidityAvailable, 6) +
      bnToNumber(solMarket.stats.totalLiquidityAvailable, 9) * solPrice;

    return {
      borrowVolume,
      availableLiquidity,
      supplyVolume,
      matchRate,
    };
  } catch (error) {
    logger.error("Error getting drift optimizer stats:", error);
    throw error;
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
  if (
    !traderPosition.lending ||
    traderPosition.lending.deposits.eq(new BN(0))
  ) {
    return {
      amount: 0,
      action_amount: new BN(0),
    };
  }
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
  if (
    !traderPosition.lending ||
    traderPosition.lending.p2pLends.eq(new BN(0))
  ) {
    return {
      amount: 0,
      action_amount: new BN(0),
    };
  }
  return {
    amount: bnToNumber(traderPosition.lending.p2pLends, decimals),
    action_amount: traderPosition.lending.p2pLends,
  };
}

function getP2PBorrowPosition(
  traderPosition: TraderPositionUI,
  decimals: number,
): PositionData {
  if (
    !traderPosition.borrowing ||
    traderPosition.borrowing.p2pBorrowed.eq(new BN(0))
  ) {
    return {
      amount: 0,
      action_amount: new BN(0),
    };
  }
  return {
    amount: bnToNumber(traderPosition.borrowing.p2pBorrowed, decimals),
    action_amount: traderPosition.borrowing.p2pBorrowed,
  };
}

function getPendingBorrowPosition(
  traderPosition: TraderPositionUI,
  decimals: number,
): PositionData {
  if (
    !traderPosition.borrowing ||
    traderPosition.borrowing.borrowPending.eq(new BN(0))
  ) {
    return {
      amount: 0,
      action_amount: new BN(0),
    };
  }
  return {
    amount: bnToNumber(traderPosition.borrowing.borrowPending, decimals),
    action_amount: traderPosition.borrowing.borrowPending,
  };
}

export const bnToNumber = (
  bn: BN | undefined | null,
  decimals: number = 9,
): number => {
  if (!bn) return 0;
  return Number(bn) / Math.pow(10, decimals);
};
