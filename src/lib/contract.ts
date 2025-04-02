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

export interface OptimizerStats {
  borrowVolume: number;
  availableLiquidity: number;
  supplyVolume: number;
  matchRate: number;
}

export async function getDriftOptimizerStats(
  paystreamProgram: PaystreamV1Program,
) {
  const marketHeaderData = await paystreamProgram.getAllMarketHeaders();
  const usdcMarket = marketHeaderData[0];
  const solMarket = marketHeaderData[1];

  console.log(marketHeaderData, "marketHeaderData");

  if (!usdcMarket || !solMarket) {
    throw new Error("Market not found");
  }

  const marketData = await paystreamProgram.getMarketDataUI(
    usdcMarket.market,
    usdcMarket.mint,
  );

  console.log(marketData, "marketData");

  const usdcMarketData = marketData;
  const solMarketData = marketData;

  const totalBorrowsUSDC = bnToNumber(usdcMarketData.stats.borrows.totalBorrowedP2p, 6);
  const totalBorrowsSOL = bnToNumber(solMarketData.stats.borrows.totalBorrowedP2p, 9);

  const totalSupplyUSDC = bnToNumber(usdcMarketData.stats.deposits.totalSupply, 6);
  const totalSupplySOL = bnToNumber(solMarketData.stats.deposits.totalSupply, 9);

  // const solPrice = await getSolanaPrice();
  const solPrice = 100;

  const borrowVolume = totalBorrowsUSDC + totalBorrowsSOL * solPrice;
  const supplyVolume = totalSupplyUSDC + totalSupplySOL * solPrice;

  const matchRate = borrowVolume / supplyVolume;

  const optimizerStats: OptimizerStats = {
    borrowVolume,
    availableLiquidity:
      bnToNumber(usdcMarketData.stats.totalLiquidityAvailable, 6) +
      bnToNumber(solMarketData.stats.totalLiquidityAvailable, 9),
    supplyVolume,
    matchRate: matchRate * 100,
  };

  return optimizerStats;
}

async function getSolanaPrice(): Promise<number> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
    );
    const data = await response.json();
    return data.solana.usd;
  } catch (error) {
    console.error("Error fetching Solana price:", error);
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
  console.log(bnToNumber(traderPosition.lending.deposits, decimals), "deposits")
  console.log(bnToNumber(traderPosition.lending.collateral.amount, decimals), "collateral")
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
