import { SOL_MINT, USDC_MINT } from "@/constants";
import { BN } from "@coral-xyz/anchor";
import { PaystreamV1Program, TraderPositionUI } from "@meimfhd/paystream-v1";
import { PublicKey } from "@solana/web3.js";

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
  const solMarket = marketHeaderData[0];
  const usdcMarket = marketHeaderData[1];

  if (!usdcMarket || !solMarket) {
    throw new Error("Market not found");
  }

  console.log(usdcMarket.market.toBase58(), "usdcMarket");
  console.log(solMarket.market.toBase58(), "solMarket");

  //TODO: change mint address to the actual mint address
  console.log("--check mint address--");
  console.log(usdcMarket.mint.toBase58(), "usdc mint");
  console.log(solMarket.mint.toBase58(), "sol mint");

  console.log(USDC_MINT, "USDC_MINT");
  console.log(SOL_MINT, "SOL_MINT");

  //TODO: change mint address to the actual mint address
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
    console.log(error, "error");
    return [];
  }
}

//TODO: incomplete
export async function getP2PMatches(
  paystreamProgram: PaystreamV1Program,
  lenderAddress: string,
) {
  const marketHeaderData = await paystreamProgram.getAllMarketHeaders();
  const solMarket = marketHeaderData[0];
  const usdcMarket = marketHeaderData[1];

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
  const solMarket = marketHeaderData[0];
  const usdcMarket = marketHeaderData[1];

  console.log(marketHeaderData, "marketHeaderData");

  if (!usdcMarket || !solMarket) {
    throw new Error("Market not found");
  }

  console.log(usdcMarket.market.toBase58(), "usdcMarket");
  console.log(solMarket.market.toBase58(), "solMarket");

  console.log(usdcMarket.mint.toBase58(), "usdcMarket mint");
  console.log(solMarket.mint.toBase58(), "solMarket mint");

  const usdcMarketData = await paystreamProgram.getMarketDataUI(
    usdcMarket.market,
    usdcMarket.mint,
  );

  const solMarketData = await paystreamProgram.getMarketDataUI(
    solMarket.market,
    solMarket.mint,
  );

  console.log(usdcMarket.market.toBase58(), "usdcMarket");
  console.log(solMarket.market.toBase58(), "solMarket");

  console.log(usdcMarket.mint.toBase58(), "usdcMarket mint");
  console.log(solMarket.mint.toBase58(), "solMarket mint");

  console.log(
    usdcMarketData.stats.borrows.totalBorrowedP2p.toString(),
    "usdcMarketData totalBorrowedP2p",
  );
  console.log(
    solMarketData.stats.borrows.totalBorrowedP2p.toString(),
    "solMarketData totalBorrowedP2p",
  );

  console.log(
    usdcMarketData.stats.borrows.borrowAmountUnmatched.toString(),
    "usdcMarketData borrowAmountUnmatched",
  );
  console.log(
    solMarketData.stats.borrows.borrowAmountUnmatched.toString(),
    "solMarketData borrowAmountUnmatched",
  );
  const totalBorrowsUSDC = bnToNumber(
    usdcMarketData.stats.borrows.totalBorrowedP2p,
    6,
  );
  const totalBorrowsSOL = bnToNumber(
    solMarketData.stats.borrows.totalBorrowedP2p,
    9,
  );

  console.log(totalBorrowsSOL, "totalBorrowsSOL");
  console.log(totalBorrowsUSDC, "totalBorrowsUSDC");

  const totalSupplyUSDC = bnToNumber(
    usdcMarketData.stats.deposits.totalSupply,
    6,
  );
  const totalSupplySOL = bnToNumber(
    solMarketData.stats.deposits.totalSupply,
    9,
  );

  //TODO: this is not modular, we should get the sol price from the market
  // const solPrice = await getSolanaPrice();
  const solPrice = 100;

  //TODO: this is not modular, this is oly implemented for USDC and SOL we need to implement for all other tokens too
  const borrowVolume = totalBorrowsUSDC + totalBorrowsSOL * solPrice;
  const supplyVolume = totalSupplyUSDC + totalSupplySOL * solPrice;

  console.log(borrowVolume, "borrowVolume");
  console.log(supplyVolume, "supplyVolume");

  const matchRate = borrowVolume / supplyVolume;
  console.log(matchRate, "matchRate");

  const optimizerStats: OptimizerStats = {
    borrowVolume,
    availableLiquidity:
      bnToNumber(usdcMarketData.stats.totalLiquidityAvailable, 6) +
      bnToNumber(solMarketData.stats.totalLiquidityAvailable, 9) * solPrice,
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
  console.log(
    bnToNumber(traderPosition.lending.deposits, decimals),
    "deposits",
  );
  console.log(
    bnToNumber(traderPosition.lending.collateral.amount, decimals),
    "collateral",
  );
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
