import { BN } from "@coral-xyz/anchor";
import { PaystreamV1Program, TraderPositionUI } from "@meimfhd/paystream-v1";

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
  const marketHeaderData = await paystreamProgram.getAllMarketHeaders();
  const usdcMarket = marketHeaderData[0];
  const solMarket = marketHeaderData[1];

  if (!usdcMarket || !solMarket) {
    throw new Error("Market not found");
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
}

//TODO: incomplete
export async function getP2PMatches(
  paystreamProgram: PaystreamV1Program,
  lenderAddress: string,
) {
  const marketHeaderData = await paystreamProgram.getAllMarketHeaders();
  const usdcMarket = marketHeaderData[0];
  const solMarket = marketHeaderData[1];

  if (!usdcMarket || !solMarket) {
    throw new Error("Market not found");
  }

  const marketData = await paystreamProgram.getMarketDataUI(
    usdcMarket.market,
    usdcMarket.mint,
  );

  const usdcMarketData = marketData.matches.find(
    (match) => match.lender === lenderAddress,
  );
  const solMarketData = marketData.matches.find(
    (match) => match.lender === lenderAddress,
  );

  // TODO: return in correct format
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
    amount: bnToNumber(traderPosition.borrowing.p2pBorrows, decimals),
    action_amount: traderPosition.borrowing.p2pBorrows,
  };
}

export const bnToNumber = (bn: BN, decimals: number = 9): number => {
  return Number(bn) / Math.pow(10, decimals);
};
