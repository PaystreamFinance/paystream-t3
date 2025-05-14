import {
  MarketConfig,
  MarketDataUI,
  MarketPriceData,
  PaystreamV1Program,
} from "@meimfhd/paystream-v1";
import { useEffect, useState } from "react";
import { usePaystreamProgram } from "./use-paystream-program";
import { PublicKey } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { logger } from "@/lib/utils";
import { AnchorProvider } from "@coral-xyz/anchor";

export function useMarketData(
  mint: PublicKey,
  collateralMint: PublicKey,
  market: PublicKey,
  collateralMarket: PublicKey,
): {
  provider: AnchorProvider | null;
  config: MarketConfig | null;
  usdcMarketData: MarketDataUI | null;
  solMarketData: MarketDataUI | null;
  priceData: MarketPriceData | null;
  loading: boolean;
  error: string | null;
  paystreamProgram: PaystreamV1Program | null;
} {
  const { paystreamProgram, provider } = usePaystreamProgram();
  const [config, setConfig] = useState<MarketConfig | null>(null);
  const [usdcMarketData, setUsdcMarketData] = useState<MarketDataUI | null>(null);
  const [solMarketData, setSolMarketData] =
    useState<MarketDataUI | null>(null);
  const [priceData, setPriceData] = useState<MarketPriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paystreamProgram || !provider) {
      return;
    }

    const fetchMarketData = async () => {
      // Get market config
      const config = await paystreamProgram.getMarketConfig(
        mint,
        collateralMint,
        market,
        collateralMarket,
      );

      if (!config) {
        setError("Market config not found");
        setLoading(false);
        throw new Error("Market config not found");
      }

      logger.info("Setting config");
      setConfig(config);

      // Get market data
      const { marketData, collateralMarketData, priceData } =
        await paystreamProgram.getMarketDataUI(config);

      if (!marketData || !collateralMarketData || !priceData) {
        setError("Market data not found");
        setLoading(false);
        throw new Error("Market data not found");
      }

      logger.info("Setting market data");
      if (marketData.marketId.toString() === "0") {
        setUsdcMarketData(marketData);
        setSolMarketData(collateralMarketData);
      } else if (collateralMarketData.marketId.toString() === "0") {
        setUsdcMarketData(collateralMarketData);
        setSolMarketData(marketData);
      } else {
        setError("Invalid market data");
        setLoading(false);
        throw new Error("Invalid market data");
      }
      logger.info("Setting price data");
      setPriceData(priceData);

      setError(null);
      setLoading(false);
    };

    async function callTryCatch() {
      const { data, error } = await tryCatch(fetchMarketData());
      if (error) {
        setError(error.message);
      }
      setLoading(false);
    }

    callTryCatch();
  }, [provider]);

  return {
    provider,
    config,
    usdcMarketData,
    solMarketData,
    priceData,
    loading,
    error,
    paystreamProgram: paystreamProgram,
  };
}

type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

// Main wrapper function
export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}
