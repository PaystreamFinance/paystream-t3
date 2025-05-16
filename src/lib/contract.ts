import { BN } from "@coral-xyz/anchor";
import {
  calculate_debt_amount_in_collateral,
  calculate_interest_accrued,
  type MarketDataUI,
  type MarketPriceData,
  type PaystreamMetrics,
  PRICE_PRECISION,
  ProtocolMetrics,
  type TraderPositionUI,
} from "@meimfhd/paystream-v1";
import { logger } from "./utils";

export interface Position {
  asset: "SOL" | "USDC";
  type:
    | "UNMATCHED"
    | "COLLATERAL"
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
  priceData: MarketPriceData,
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
        type: "COLLATERAL",
        apy: bnToNumber(usdcProtocolMetrics.protocolMetrics.depositRate, 4),
        positionData: getTotalDepositPosition(
          usdcTrader,
          priceData,
          solTrader,
          usdcProtocolMetrics,
        ),
      });
      positions.push({
        asset: "USDC",
        type: "UNMATCHED",
        apy: bnToNumber(usdcProtocolMetrics.protocolMetrics.depositRate, 4),
        positionData: getLendingPosition(
          usdcTrader,
          usdcProtocolMetrics,
          priceData,
        ),
      });
      positions.push({
        asset: "USDC",
        type: "P2P LEND",
        apy: bnToNumber(usdcProtocolMetrics.midRateApy, 4),
        positionData: getP2PLendingPosition(
          usdcTrader,
          usdcMarket,
          usdcProtocolMetrics,
          priceData,
        ),
      });
      positions.push({
        asset: "USDC",
        type: "P2P BORROW",
        apy: bnToNumber(usdcProtocolMetrics.midRateApy, 4),
        positionData: getP2PBorrowPosition(
          usdcTrader,
          priceData,
          solMarket,
          solProtocolMetrics,
        ),
      });
      positions.push({
        asset: "USDC",
        type: "PENDING BORROW",
        apy: 0,
        positionData: getPendingBorrowPosition(
          usdcTrader,
          usdcMarket,
          usdcProtocolMetrics,
          priceData,
        ),
      });
    }

    if (solMarket && solTrader) {
      positions.push({
        asset: "SOL",
        type: "COLLATERAL",
        apy: bnToNumber(solProtocolMetrics.protocolMetrics.depositRate, 4),
        positionData: getTotalDepositPosition(
          solTrader,
          priceData,
          usdcTrader,
          solProtocolMetrics,
        ),
      });
      positions.push({
        asset: "SOL",
        type: "UNMATCHED",
        apy: bnToNumber(solProtocolMetrics.protocolMetrics.depositRate, 4),
        positionData: getLendingPosition(
          solTrader,
          solProtocolMetrics,
          priceData,
        ),
      });
      positions.push({
        asset: "SOL",
        type: "P2P LEND",
        apy: bnToNumber(solProtocolMetrics.midRateApy, 4),
        positionData: getP2PLendingPosition(
          solTrader,
          solMarket,
          solProtocolMetrics,
          priceData,
        ),
      });

      positions.push({
        asset: "SOL",
        type: "P2P BORROW",
        apy: bnToNumber(solProtocolMetrics.midRateApy, 4),
        positionData: getP2PBorrowPosition(
          solTrader,
          priceData,
          usdcMarket,
          usdcProtocolMetrics,
        ),
      });
      positions.push({
        asset: "SOL",
        type: "PENDING BORROW",
        apy: 0,
        positionData: getPendingBorrowPosition(
          solTrader,
          usdcMarket,
          usdcProtocolMetrics,
          priceData,
        ),
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
          id: match.id.toNumber(),
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
          id: match.id.toNumber(),
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
  availableLiquidityInUSD: number;
  supplyVolume: number;
  matchRate: number;
  apyImprovement: BN;
}

export function getDriftOptimizerStats(
  usdcMarket: MarketDataUI,
  solMarket: MarketDataUI,
  solProtocolMetrics: PaystreamMetrics<"drift">,
): OptimizerStats {
  try {
    const borrowVolume =
      solMarket.stats.borrows.totalBorrowedP2pInUSD +
      usdcMarket.stats.borrows.totalBorrowedP2pInUSD;

    const supplyVolume =
      solMarket.stats.deposits.totalSupplyInUSD +
      usdcMarket.stats.deposits.totalSupplyInUSD;

    const availableLiquidityInUSD =
      usdcMarket.stats.totalLiquidityAvailableInUSD +
      solMarket.stats.totalLiquidityAvailableInUSD;

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

export interface PositionData {
  amount: BN;
  amountInUSD: number;
  lockedAmount: BN | null;
  lockedAmountInUSD: number | null;
  interestAccrued: BN | null;
  interestAccruedInUSD: number | null;
}

function getTotalDepositPosition(
  traderPosition: TraderPositionUI,
  priceData: MarketPriceData,
  traderCollateralPosition: TraderPositionUI | undefined,
  metrics: PaystreamMetrics<"drift">,
): PositionData | null {
  if (
    !traderPosition.lending ||
    traderPosition.lending.collateral.amount.eq(new BN(0))
  ) {
    return null;
  }
  const totalBorrowedCollateral =
    (traderCollateralPosition &&
      traderCollateralPosition.borrowing.borrowPending.add(
        traderCollateralPosition.borrowing.p2pBorrowed,
      )) ??
    new BN(0);
  const totalBorrowedCollateralInBorrowMint =
    calculate_debt_amount_in_collateral(
      totalBorrowedCollateral.toNumber(),
      priceData.collateralPriceInBorrowMintScaled.toNumber(),
      9,
      6,
    );
  const totalBorrowedCollateralInUSD =
    totalBorrowedCollateralInBorrowMint
      .mul(priceData.collateralPriceInBorrowMintScaled)
      .div(PRICE_PRECISION)
      .toNumber() / PRICE_PRECISION.toNumber();

  // const interestAccrued = calculate_interest_accrued(
  //   traderPosition.lending.collateral.amount,
  //   metrics.protocolMetrics.depositRate,
  //   new BN(100 * 365 * 24 * 60 * 60 * 1000), // 100 years in milliseconds
  // );
  // const totalInterestAccruedInUSD =
  //   interestAccrued
  //     .mul(priceData.borrowPriceInCollateralMintScaled)
  //     .div(PRICE_PRECISION)
  //     .toNumber() / PRICE_PRECISION.toNumber();

  return {
    amount: traderPosition.lending.collateral.amount,
    amountInUSD: traderPosition.lending.collateral.amountInUSD,
    lockedAmount: totalBorrowedCollateralInBorrowMint,
    lockedAmountInUSD: totalBorrowedCollateralInUSD,
    interestAccrued: null,
    interestAccruedInUSD: null,
  };
}

function getLendingPosition(
  traderPosition: TraderPositionUI,
  metrics: PaystreamMetrics<"drift">,
  priceData: MarketPriceData,
): PositionData | null {
  if (
    !traderPosition.lending ||
    traderPosition.lending.onVaultLends.eq(new BN(0))
  ) {
    return null;
  }
  const interestAccrued = calculate_interest_accrued(
    traderPosition.lending.onVaultLends,
    metrics.protocolMetrics.depositRate,
    new BN(new Date().getTime() - new Date().getTime() / 1000),
  );
  const totalInterestAccruedInUSD =
    interestAccrued
      .mul(priceData.borrowPriceInCollateralMintScaled)
      .div(PRICE_PRECISION)
      .toNumber() / PRICE_PRECISION.toNumber();
  return {
    amount: traderPosition.lending.onVaultLends,
    amountInUSD: traderPosition.lending.onVaultLendsInUSD,
    interestAccrued: interestAccrued,
    interestAccruedInUSD: totalInterestAccruedInUSD,
    lockedAmount: null,
    lockedAmountInUSD: null,
  };
}

function getP2PLendingPosition(
  traderPosition: TraderPositionUI,
  marketData: MarketDataUI,
  metrics: PaystreamMetrics<"drift">,
  priceData: MarketPriceData,
): PositionData | null {
  if (
    !traderPosition.lending ||
    traderPosition.lending.p2pLends.eq(new BN(0))
  ) {
    return null;
  }
  const lendingInterestAccrued = marketData.matches
    .filter((match) => match.lender === traderPosition.address)
    .map((match) => {
      const interestAccrued = calculate_interest_accrued(
        match.amount,
        metrics.midRateApy,
        new BN(match.timestamp.getTime() - new Date().getTime() / 1000),
      );
      return interestAccrued;
    })
    .reduce((acc, curr) => {
      return acc.add(curr);
    }, new BN(0));
  const totalInterestAccruedInUSD =
    lendingInterestAccrued
      .mul(priceData.borrowPriceInCollateralMintScaled)
      .div(PRICE_PRECISION)
      .toNumber() / PRICE_PRECISION.toNumber();
  return {
    amount: traderPosition.lending.p2pLends,
    amountInUSD: traderPosition.lending.p2pLendsInUsdValue,
    interestAccrued: lendingInterestAccrued,
    interestAccruedInUSD: totalInterestAccruedInUSD,
    lockedAmount: null,
    lockedAmountInUSD: null,
  };
}

function getP2PBorrowPosition(
  traderPosition: TraderPositionUI,
  priceData: MarketPriceData,
  collateralMarketData: MarketDataUI,
  metrics: PaystreamMetrics<"drift">,
): PositionData | null {
  if (
    !traderPosition.borrowing ||
    traderPosition.borrowing.p2pBorrowed.eq(new BN(0))
  ) {
    return null;
  }

  const borrowingInterestAccrued = collateralMarketData.matches
    .filter((match) => match.borrower === traderPosition.address)
    .map((match) => {
      const interestAccrued = calculate_interest_accrued(
        match.amount,
        metrics.midRateApy,
        new BN(match.timestamp.getTime() - new Date().getTime() / 1000),
      );
      return interestAccrued;
    })
    .reduce((acc, curr) => {
      return acc.add(curr);
    }, new BN(0));
  const totalInterestAccruedInUSD =
    borrowingInterestAccrued
      .mul(priceData.borrowPriceInCollateralMintScaled)
      .div(PRICE_PRECISION)
      .toNumber() / PRICE_PRECISION.toNumber();

  const totalCollateralLocked = calculate_debt_amount_in_collateral(
    traderPosition.borrowing.p2pBorrowed.toNumber(),
    priceData.collateralPriceInBorrowMintScaled.toNumber(),
    9,
    6,
  );
  const totalCollateralLockedInUSD =
    totalCollateralLocked
      .mul(priceData.borrowPriceInCollateralMintScaled)
      .div(PRICE_PRECISION)
      .toNumber() / PRICE_PRECISION.toNumber();
  return {
    amount: traderPosition.borrowing.p2pBorrowed,
    amountInUSD: traderPosition.borrowing.p2pBorrowedInUSD,
    interestAccrued: borrowingInterestAccrued,
    interestAccruedInUSD: totalInterestAccruedInUSD,
    lockedAmount: totalCollateralLocked,
    lockedAmountInUSD: totalCollateralLockedInUSD,
  };
}

function getPendingBorrowPosition(
  traderPosition: TraderPositionUI,
  collateralMarketData: MarketDataUI,
  metrics: PaystreamMetrics<"drift">,
  priceData: MarketPriceData,
): PositionData | null {
  if (
    !traderPosition.borrowing ||
    traderPosition.borrowing.borrowPending.eq(new BN(0))
  ) {
    return null;
  }
  const interestAccrued = collateralMarketData.matches
    .filter((match) => match.borrower === traderPosition.address)
    .map((match) => {
      const interestAccrued = calculate_interest_accrued(
        match.amount,
        metrics.midRateApy,
        new BN(match.timestamp.getTime() - new Date().getTime() / 1000),
      );
      return interestAccrued;
    })
    .reduce((acc, curr) => {
      return acc.add(curr);
    }, new BN(0));
  const totalInterestAccruedInUSD =
    interestAccrued
      .mul(priceData.borrowPriceInCollateralMintScaled)
      .div(PRICE_PRECISION)
      .toNumber() / PRICE_PRECISION.toNumber();
  return {
    amount: traderPosition.borrowing.borrowPending,
    amountInUSD: traderPosition.borrowing.borrowPendingInUSD,
    interestAccrued: interestAccrued,
    interestAccruedInUSD: totalInterestAccruedInUSD,
    lockedAmount: null,
    lockedAmountInUSD: null,
  };
}

export const bnToNumber = (
  bn: BN | undefined | null,
  decimals: number = 9,
): number => {
  if (!bn) return 0;
  return Number(bn) / Math.pow(10, decimals);
};
