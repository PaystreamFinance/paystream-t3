import type {
  MarketConfig,
  MarketDataUI,
  MarketPriceData,
  PaystreamMetrics,
} from "@meimfhd/paystream-v1";
import { PaystreamV1Program } from "@meimfhd/paystream-v1";
import { useEffect, useState, useRef, useCallback } from "react";

import { Connection, type PublicKey } from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";
import { logger } from "@/lib/utils";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

export function useMarketData(
  mint: PublicKey,
  collateralMint: PublicKey,
  market: PublicKey,
  collateralMarket: PublicKey,
) {
  const [paystreamProgram, setPaystreamProgram] =
    useState<PaystreamV1Program | null>(null);
  const wallet = useAnchorWallet();
  const [provider, setProvider] = useState<AnchorProvider | null>(null);

  const [usdcConfig, setUsdcConfig] = useState<MarketConfig | null>(null);
  const [solConfig, setSolConfig] = useState<MarketConfig | null>(null);
  const [usdcMarketData, setUsdcMarketData] = useState<MarketDataUI | null>(
    null,
  );
  const [solMarketData, setSolMarketData] = useState<MarketDataUI | null>(null);
  const [priceData, setPriceData] = useState<MarketPriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usdcProtocolMetrics, setUsdcProtocolMetrics] =
    useState<PaystreamMetrics<"drift"> | null>(null);
  const [solProtocolMetrics, setSolProtocolMetrics] =
    useState<PaystreamMetrics<"drift"> | null>(null);
  const [refresh, setRefresh] = useState(false);
  // Use ref to prevent redundant API calls
  const fetchingRef = useRef(false);

  const fetchAllData = useCallback(async () => {
    // Mark as fetching to prevent duplicate calls
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);

    if (!wallet) {
      setLoading(false);
      fetchingRef.current = false;
      return;
    }

    const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL!, {
      commitment: "confirmed",
    });
    const provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
      maxRetries: 3,
      preflightCommitment: "confirmed",
    });
    const paystreamProgram = new PaystreamV1Program(provider);
    setPaystreamProgram(paystreamProgram);
    setProvider(provider);

    try {
      // STEP 1: Fetch configs
      logger.info("Fetching market configs");
      const [usdcConfigResult, solConfigResult] = await Promise.all([
        paystreamProgram.getMarketConfig(
          mint,
          collateralMint,
          market,
          collateralMarket,
        ),
        paystreamProgram.getMarketConfig(
          collateralMint,
          mint,
          collateralMarket,
          market,
        ),
      ]);

      if (!usdcConfigResult || !solConfigResult) {
        setError("Market config not found");
        return;
      }

      setUsdcConfig(usdcConfigResult);
      setSolConfig(solConfigResult);

      // STEP 2: Fetch market data
      logger.info("Fetching market data");
      const {
        marketData,
        collateralMarketData,
        priceData: fetchedPriceData,
      } = await paystreamProgram.getMarketDataUI(usdcConfigResult);

      if (!marketData || !collateralMarketData || !fetchedPriceData) {
        setError("Market data not found");
        return;
      }

      // Determine which market is which based on marketId
      let resolvedUsdcMarketData: MarketDataUI;
      let resolvedSolMarketData: MarketDataUI;

      if (marketData.marketId.toString() === "0") {
        resolvedUsdcMarketData = marketData;
        resolvedSolMarketData = collateralMarketData;
      } else if (collateralMarketData.marketId.toString() === "0") {
        resolvedUsdcMarketData = collateralMarketData;
        resolvedSolMarketData = marketData;
      } else {
        setError("Invalid market data");
        return;
      }

      setUsdcMarketData(resolvedUsdcMarketData);
      setSolMarketData(resolvedSolMarketData);
      setPriceData(fetchedPriceData);

      // STEP 3: Fetch protocol metrics
      logger.info("Fetching protocol metrics");
      const [usdcMetrics, solMetrics] = await Promise.all([
        paystreamProgram.getProtocolMetrics(
          usdcConfigResult,
          resolvedUsdcMarketData,
        ),
        paystreamProgram.getProtocolMetrics(
          solConfigResult,
          resolvedSolMarketData,
        ),
      ]);

      if (!usdcMetrics) {
        setError("USDC protocol metrics not found");
        return;
      }

      if (!solMetrics) {
        setError("SOL protocol metrics not found");
        return;
      }

      setUsdcProtocolMetrics(usdcMetrics);
      setSolProtocolMetrics(solMetrics);
      setError(null);
    } catch (err: any) {
      logger.error("Error fetching market data:", err);
      setError(err.message || "Failed to fetch market data");
    } finally {
      setLoading(false);
      // Reset fetching flag with slight delay to prevent immediate re-triggering
      setTimeout(() => {
        fetchingRef.current = false;
      }, 5000);
    }
  }, [collateralMarket, collateralMint, market, mint, wallet]);

  // Handle initial load and changes to dependencies
  useEffect(() => {
    if (!wallet) return;
    fetchAllData();
  }, [fetchAllData, wallet]);

  // Handle manual refresh
  useEffect(() => {
    if (refresh) {
      console.log("refreshing");
      fetchAllData().then(() => {
        // Reset refresh state after fetching
        setRefresh(false);
        console.log("refreshed");
      });
    }
  }, [refresh, fetchAllData]);

  return {
    provider,
    usdcConfig,
    solConfig,
    usdcMarketData,
    solMarketData,
    priceData,
    loading,
    error,
    usdcProtocolMetrics,
    solProtocolMetrics,
    paystreamProgram,
    refresh,
    setRefresh,
  };
}
