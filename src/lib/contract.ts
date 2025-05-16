import { BN } from "@coral-xyz/anchor";
import {
  MarketDataUI,
  MarketPriceData,
  PaystreamMetrics,
  ProtocolMetrics,
  TraderPositionUI,
} from "@meimfhd/paystream-v1";
import { logger } from "./utils";

export interface Position {
  asset: "SOL" | "USDC";
  type:
    | "UNMATCHED"
    | "TOTAL DEPOSIT"
    | "P2P LEND"
    | "P2P BORROW"
    | "PENDING BORROW";
  apy: number | null;
  positionData: PositionData | null;
}

export function getTraderPositions(
  address: string,
  usdcMarket: MarketDataUI,
  solMarket: MarketDataUI,
  usdcProtocolMetrics: PaystreamMetrics<"drift">,
  solProtocolMetrics: PaystreamMetrics<"drift">,
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
        type: "TOTAL DEPOSIT",
        apy: bnToNumber(usdcProtocolMetrics.protocolMetrics.depositRate, 4),
        positionData: getTotalDepositPosition(usdcTrader, 6),
      });
      positions.push({
        asset: "USDC",
        type: "UNMATCHED",
        apy: bnToNumber(usdcProtocolMetrics.protocolMetrics.depositRate, 4),
        positionData: getLendingPosition(usdcTrader, 6),
      });
      positions.push({
        asset: "USDC",
        type: "P2P LEND",
        apy: bnToNumber(usdcProtocolMetrics.midRateApy, 4),
        positionData: getP2PLendingPosition(usdcTrader, 6),
      });
      positions.push({
        asset: "USDC",
        type: "P2P BORROW",
        apy: bnToNumber(usdcProtocolMetrics.midRateApy, 4),
        positionData: getP2PBorrowPosition(usdcTrader, 6),
      });
      positions.push({
        asset: "USDC",
        type: "PENDING BORROW",
        apy: 0,
        positionData: getPendingBorrowPosition(usdcTrader, 6),
      });
    }

    if (solMarket && solTrader) {
      positions.push({
        asset: "SOL",
        type: "TOTAL DEPOSIT",
        apy: bnToNumber(solProtocolMetrics.protocolMetrics.depositRate, 4),
        positionData: getTotalDepositPosition(solTrader, 9),
      });
      positions.push({
        asset: "SOL",
        type: "UNMATCHED",
        apy: bnToNumber(solProtocolMetrics.protocolMetrics.depositRate, 4),
        positionData: getLendingPosition(solTrader, 9),
      });
      positions.push({
        asset: "SOL",
        type: "P2P LEND",
        apy: bnToNumber(solProtocolMetrics.midRateApy, 4),
        positionData: getP2PLendingPosition(solTrader, 9),
      });
      positions.push({
        asset: "SOL",
        type: "P2P BORROW",
        apy: bnToNumber(solProtocolMetrics.midRateApy, 4),
        positionData: getP2PBorrowPosition(solTrader, 9),
      });
      positions.push({
        asset: "SOL",
        type: "PENDING BORROW",
        apy: 0,
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
  availableLiquidityInUSD: number;
  supplyVolume: number;
  matchRate: number;
  apyImprovement: BN;
}

export function getDriftOptimizerStats(
  usdcMarket: MarketDataUI,
  solMarket: MarketDataUI,
  priceData: MarketPriceData,
  solProtocolMetrics: PaystreamMetrics<"drift">,
): OptimizerStats {
  try {
    const solPrice = priceData.originalCollateralPrice;
    const usdcPrice = priceData.originalMarketPrice;

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

    // Calculate total unmatched lending amounts in USD terms
    const totalLendAmountUnmatched =
      bnToNumber(usdcMarket.stats.deposits.lendAmountUnmatched, 6) +
      bnToNumber(solMarket.stats.deposits.lendAmountUnmatched, 9) * solPrice;

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

    // Calculate aggregated metrics in USD terms
    const totalCollateral =
      solMarket.stats.deposits.collateral +
      usdcMarket.stats.deposits.collateral;
    const borrowVolume =
      solMarket.stats.borrows.totalBorrowedP2pInUSD +
      usdcMarket.stats.borrows.totalBorrowedP2pInUSD;
    console.log("borrowVolume", borrowVolume);
    const supplyVolume =
      solMarket.stats.deposits.totalSupplyInUSD +
      usdcMarket.stats.deposits.totalSupplyInUSD;

    const totalAmountInP2p =
      bnToNumber(usdcMarket.stats.totalAmountInP2p, 6) +
      bnToNumber(solMarket.stats.totalAmountInP2p, 9) * solPrice;

    const totalLendingVolume = supplyVolume - totalCollateral;

    const availableLiquidity =
      bnToNumber(usdcMarket.stats.totalLiquidityAvailable, 6) +
      bnToNumber(solMarket.stats.totalLiquidityAvailable, 9) * solPrice;

    const availableLiquidityInUSD =
      usdcMarket.stats.totalLiquidityAvailableInUSD +
      solMarket.stats.totalLiquidityAvailableInUSD;

    const totalLiquidityAvailable =
      usdcMarket.stats.totalLiquidityAvailable +
      solMarket.stats.totalLiquidityAvailable;

    // Calculate match rate as the percentage of matched P2P volume relative to total lending volume
    console.log(
      "availableLiquidityInUSD + borrowVolume",
      availableLiquidityInUSD + borrowVolume,
    );
    const matchRate =
      borrowVolume > 0
        ? (borrowVolume / (availableLiquidityInUSD + borrowVolume)) * 100
        : 0;

    const apyImprovement = solProtocolMetrics.midRateApy
      .sub(solProtocolMetrics.protocolMetrics.depositRate)
      .mul(new BN(100))
      .div(solProtocolMetrics.protocolMetrics.depositRate);

    return {
      borrowVolume,
      availableLiquidity,
      availableLiquidityInUSD,
      supplyVolume,
      matchRate,
      apyImprovement,
    };
  } catch (error) {
    logger.error("Error getting drift optimizer stats:", error);
    throw error;
  }
}

interface PositionData {
  amount: number;
  amountInUSD: number;
}

function getTotalDepositPosition(
  traderPosition: TraderPositionUI,
  decimals: number,
): PositionData | null {
  if (
    !traderPosition.lending ||
    traderPosition.lending.collateral.amount.eq(new BN(0))
  ) {
    return null;
  }
  return {
    amount: bnToNumber(traderPosition.lending.collateral.amount, decimals),
    amountInUSD: traderPosition.lending.collateral.amountInUSD,
  };
}

function getLendingPosition(
  traderPosition: TraderPositionUI,
  decimals: number,
): PositionData | null {
  if (
    !traderPosition.lending ||
    traderPosition.lending.onVaultLends.eq(new BN(0))
  ) {
    return null;
  }
  return {
    amount: bnToNumber(traderPosition.lending.onVaultLends, decimals),
    amountInUSD: traderPosition.lending.onVaultLendsInUSD,
  };
}

function getP2PLendingPosition(
  traderPosition: TraderPositionUI,
  decimals: number,
): PositionData | null {
  if (
    !traderPosition.lending ||
    traderPosition.lending.p2pLends.eq(new BN(0))
  ) {
    return null;
  }
  return {
    amount: bnToNumber(traderPosition.lending.p2pLends, decimals),
    amountInUSD: traderPosition.lending.p2pLendsInUsdValue,
  };
}

function getP2PBorrowPosition(
  traderPosition: TraderPositionUI,
  decimals: number,
): PositionData | null {
  if (
    !traderPosition.borrowing ||
    traderPosition.borrowing.p2pBorrowed.eq(new BN(0))
  ) {
    return null;
  }
  return {
    amount: bnToNumber(traderPosition.borrowing.p2pBorrowed, decimals),
    amountInUSD: traderPosition.borrowing.p2pBorrowedInUSD,
  };
}

function getPendingBorrowPosition(
  traderPosition: TraderPositionUI,
  decimals: number,
): PositionData | null {
  if (
    !traderPosition.borrowing ||
    traderPosition.borrowing.borrowPending.eq(new BN(0))
  ) {
    return null;
  }
  return {
    amount: bnToNumber(traderPosition.borrowing.borrowPending, decimals),
    amountInUSD: traderPosition.borrowing.borrowPendingInUSD,
  };
}

export const bnToNumber = (
  bn: BN | undefined | null,
  decimals: number = 9,
): number => {
  if (!bn) return 0;
  return Number(bn) / Math.pow(10, decimals);
};
