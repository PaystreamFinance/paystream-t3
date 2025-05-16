"use client";

import { Button } from "@/components/ui/button";
import * as anchor from "@coral-xyz/anchor";
import dynamic from "next/dynamic";

import LoadingOverlay from "@/components/loading-overlay";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import {
  SOL_HEADER_INDEX,
  SOL_MINT,
  USDC_HEADER_INDEX,
  USDC_MINT,
} from "@/constants";
import { useMarketData } from "@/hooks/useMarketData";
import { bnToNumber } from "@/lib/contract";
import { getTableData } from "@/lib/data";
import { useVaultStateStore } from "@/store/vault-state-store";
import { AnchorProvider, BN, utils } from "@coral-xyz/anchor";
import {
  MarketConfig,
  MarketHeaderWithPubkey,
  PRICE_PRECISION,
  PaystreamV1Program,
  type TraderPositionUI,
  calculate_max_borrow_amount,
} from "@meimfhd/paystream-v1";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { type VaultDataProps } from "./hero";
import { TokenAmount } from "@solana/web3.js";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton,
    ),
  { ssr: false },
);

export default function VaultActions({ vaultTitle, icon }: VaultDataProps) {
  // const [solBalance, setSolBalance] = useState<number | null>(null);
  // const [usdcBalance, setUSDCBalance] = useState<number | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [collateralBalance, setCollateralBalance] = useState<number | null>(
    null,
  );
  const [usdcTokenAccountExists, setUsdcTokenAccountExists] = useState<
    boolean | null
  >(null);
  const [solTrader, setSolTrader] = useState<
    TraderPositionUI | null | undefined
  >(undefined);
  const [usdcTrader, setUsdcTrader] = useState<
    TraderPositionUI | null | undefined
  >(undefined);
  const [isCollateral, setIsCollateral] = useState(false);
  const [collateralAmountToShow, setCollateralAmountToShow] = useState<
    number | null
  >(null);
  const [inputValue, setInputValue] = useState("0");
  const vaultState = useVaultStateStore((state) => state.vaultState);
  const [isLoading, setIsLoading] = useState(false);

  const [leverageValue, setLeverageValue] = useState(33);
  const [isDragging, setIsDragging] = useState(false);
  const [isLendingDisabled, setIsLendingDisabled] = useState<boolean | null>(
    null,
  );
  const [isInsufficientCollateral, setIsInsufficientCollateral] = useState<
    boolean | null
  >(null);
  const [isInsufficientBalance, setIsInsufficientBalance] = useState<
    boolean | null
  >(null);
  const [isBorrowDisabled, setIsBorrowDisabled] = useState<boolean | null>(
    null,
  );

  const [supplyType, setSupplyType] = useState<"p2p" | "collateral">("p2p");

  const inputRef = useRef<HTMLInputElement>(null);

  const {
    usdcConfig,
    solConfig,
    usdcMarketData,
    solMarketData,
    priceData,
    loading: loadingMarketData,
    error,
    paystreamProgram,
    provider,
    usdcProtocolMetrics,
    solProtocolMetrics,
    refresh,
    setRefresh,
  } = useMarketData(
    new anchor.web3.PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
    new anchor.web3.PublicKey("So11111111111111111111111111111111111111112"),
    new anchor.web3.PublicKey("CCQXHfu51HEpiaegMU2kyYZK7dw1NhNbAX6cV44gZDJ8"),
    new anchor.web3.PublicKey("GSjnD3XA1ezr7Xew3PZKPJdKGhjWEGefFFxXJhsfrX5e"),
  );

  const checkIsLendingDisabled = useCallback(() => {
    if (vaultState !== "lend") return;
    if (
      !usdcConfig ||
      !solConfig ||
      !usdcMarketData ||
      !solMarketData ||
      !provider
    )
      return;
    const usdcTrader = usdcMarketData.traders.find(
      (trader) => trader.address === provider.publicKey.toBase58(),
    );
    const solTrader = solMarketData.traders.find(
      (trader) => trader.address === provider.publicKey.toBase58(),
    );
    setSolTrader(solTrader ?? null);
    setUsdcTrader(usdcTrader ?? null);
    const isLendingDisabled =
      (vaultState === "lend" &&
      vaultTitle === "USDC" &&
      usdcTrader?.isLender === false
        ? true
        : false) ||
      (vaultState === "lend" &&
      vaultTitle === "SOL" &&
      solTrader?.isLender === false
        ? true
        : false);
    setIsLendingDisabled(isLendingDisabled);
  }, [
    usdcConfig,
    solConfig,
    vaultTitle,
    vaultState,
    solMarketData,
    usdcMarketData,
    provider,
  ]);
  const checkIsBorrowDisabled = useCallback(() => {
    if (vaultState !== "borrow") return;
    if (
      !usdcConfig ||
      !solConfig ||
      !usdcMarketData ||
      !solMarketData ||
      !provider
    )
      return;
    const usdcTrader = usdcMarketData.traders.find(
      (trader) => trader.address === provider.publicKey.toBase58(),
    );
    const solTrader = solMarketData.traders.find(
      (trader) => trader.address === provider.publicKey.toBase58(),
    );
    setSolTrader(solTrader ?? null);
    setUsdcTrader(usdcTrader ?? null);

    const isBorrowDisabled =
      vaultState === "borrow" &&
      vaultTitle === "USDC" &&
      usdcTrader?.isLender === true
        ? true
        : false ||
          (vaultState === "borrow" &&
          vaultTitle === "SOL" &&
          solTrader?.isLender === true
            ? true
            : false);
    setIsBorrowDisabled(isBorrowDisabled);
  }, [
    usdcConfig,
    solConfig,
    vaultTitle,
    vaultState,
    solMarketData,
    usdcMarketData,
    provider,
  ]);

  useEffect(() => {
    checkIsLendingDisabled();
  }, [checkIsLendingDisabled]);
  useEffect(() => {
    checkIsBorrowDisabled();
  }, [checkIsBorrowDisabled]);

  const fetchCollateralAmount = useCallback(async () => {
    console.log("fetching collateral balance");
    if (vaultState !== "borrow") return;
    if (
      !provider ||
      !vaultTitle ||
      !solMarketData ||
      !usdcMarketData ||
      !paystreamProgram ||
      !usdcConfig ||
      !solConfig ||
      !vaultState
    )
      return;

    if (loadingMarketData) return;
    console.log("fetching collateral amount");
    const decimals = vaultTitle === "SOL" ? LAMPORTS_PER_SOL : 1_000_000;

    const amount = new BN(Number(inputValue) * decimals);

    const collateralAmount =
      vaultTitle === "USDC"
        ? await paystreamProgram.calculateRequiredCollateral(
            usdcConfig,
            amount,
            usdcConfig.collateralLtvRatio,
          )
        : await paystreamProgram.calculateRequiredCollateral(
            solConfig,
            amount,
            solConfig.collateralLtvRatio,
          );
    console.log(collateralAmount.toString(), "collateral amount");
    const collateralBalance: BN | undefined =
      vaultTitle === "USDC"
        ? solMarketData.traders.find(
            (trader) => trader.address === provider.publicKey.toBase58(),
          )?.lending.collateral.amount
        : usdcMarketData.traders.find(
            (trader) => trader.address === provider.publicKey.toBase58(),
          )?.lending.collateral.amount;

    const collateralBalanceFrozen =
      vaultTitle === "USDC"
        ? (solTrader?.borrowing.p2pBorrowed ?? new BN(0)).add(
            solTrader?.borrowing.borrowPending ?? new BN(0),
          )
        : (usdcTrader?.borrowing.p2pBorrowed ?? new BN(0)).add(
            usdcTrader?.borrowing.borrowPending ?? new BN(0),
          );
    console.log(
      collateralBalanceFrozen.toString(),
      "collateral balance frozen",
    );
    console.log(collateralBalance?.toString(), "collateral balance");
    const remainingCollateralBalance = collateralBalance
      ? new BN(collateralBalance).sub(new BN(collateralBalanceFrozen))
      : new BN(0);
    console.log(
      remainingCollateralBalance.toString(),
      "remaining collateral balance",
    );
    // we are reversing the collateral amount because if vaultTitle is USDC, then collateral amount is in SOL
    const collateralDecimals =
      vaultTitle === "USDC" ? LAMPORTS_PER_SOL : 1_000_000;
    const balanceDecimals =
      vaultTitle === "USDC" ? 1_000_000 : LAMPORTS_PER_SOL;
    if (collateralAmount.gt(remainingCollateralBalance)) {
      console.log("insufficient collateral detected");
      setIsInsufficientCollateral(true);
    } else {
      console.log("sufficient collateral detected");
      setIsInsufficientCollateral(false);
    }
    setCollateralBalance(
      Number(
        (Number(remainingCollateralBalance) / collateralDecimals).toFixed(6),
      ),
    );
    setCollateralAmountToShow(
      Number((Number(collateralAmount) / collateralDecimals).toFixed(6)),
    );

    console.log(collateralAmount, `collateral amount for ${vaultTitle}`);
  }, [
    provider,
    inputValue,
    vaultTitle,
    solMarketData,
    usdcMarketData,
    paystreamProgram,
    usdcConfig,
    solConfig,
    vaultState,
    loadingMarketData,
    solTrader,
    usdcTrader,
  ]);
  // fetch wallet balance to be shown in the UI
  const fetchBalance = useCallback(async () => {
    if (vaultState !== "lend") return;
    if (!provider) {
      return;
    }

    const usdcMint = new PublicKey(
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    ); // Mainnet USDC mint address
    const tokenAccount = utils.token.associatedAddress({
      mint: usdcMint,
      owner: provider.publicKey,
    });

    const solBalance = await provider.connection.getBalance(provider.publicKey);

    const tokenAccountInfo =
      await provider.connection.getAccountInfo(tokenAccount);
    setUsdcTokenAccountExists(tokenAccountInfo ? true : false);
    const usdcBalanceTokenAccount = tokenAccountInfo
      ? await provider.connection.getTokenAccountBalance(tokenAccount)
      : null;

    const usdcBalance = usdcBalanceTokenAccount
      ? usdcBalanceTokenAccount.value.amount
      : "0";

    if (vaultTitle === "SOL") {
      console.log(solBalance, "sol balance");
      const balance = Number(solBalance / LAMPORTS_PER_SOL);
      console.log(balance, "sol balance");
      if (balance < Number(inputValue)) {
        setIsInsufficientBalance(true);
      } else {
        setIsInsufficientBalance(false);
      }
      setBalance(balance);
    } else if (vaultTitle === "USDC") {
      console.log(usdcBalance, "usdc balance");
      const balance = Number((Number(usdcBalance) / 1_000_000).toFixed(6));
      console.log(balance, "usdc balance");
      if (balance < Number(inputValue)) {
        setIsInsufficientBalance(true);
      } else {
        setIsInsufficientBalance(false);
      }
      setBalance(balance);
    }
  }, [vaultState, provider, vaultTitle, inputValue]);

  useEffect(() => {
    fetchBalance();
    const intervalId = setInterval(fetchBalance, 10000);
    return () => clearInterval(intervalId);
  }, [fetchBalance, vaultState]);

  useEffect(() => {
    fetchCollateralAmount();
    const intervalId = setInterval(fetchCollateralAmount, 10000);
    return () => clearInterval(intervalId);
  }, [fetchCollateralAmount, vaultState]);

  const handleSupply = async () => {
    if (
      !inputValue ||
      !provider ||
      !paystreamProgram ||
      !usdcMarketData ||
      !solMarketData ||
      !priceData ||
      !usdcConfig ||
      !solConfig
    )
      return;

    if (loadingMarketData) return;
    // Check if input amount exceeds balance
    const amount = Number(inputValue);
    try {
      setIsLoading(true);

      const decimals = vaultTitle === "SOL" ? LAMPORTS_PER_SOL : 1_000_000; // 9 decimals for SOL, 6 for USDC
      const amountBN = new BN(amount * decimals);

      console.log("test");
      console.log(usdcConfig.ltvRatio, "market config");
      console.log(usdcConfig.mint.toBase58(), "mint");
      console.log(usdcConfig.market.toBase58(), "market");

      if (!usdcConfig || !solConfig) return;

      const isP2pSolEnabled = solMarketData.traders.find(
        (trader) => trader.address === provider.publicKey?.toBase58(),
      )?.isP2pEnabled;
      const isP2pUsdcEnabled = usdcMarketData.traders.find(
        (trader) => trader.address === provider.publicKey?.toBase58(),
      )?.isP2pEnabled;

      if (isInsufficientBalance) {
        toast.error("Insufficient balance");
        setIsLoading(false);
        return;
      }
      if (isCollateral) {
        const result = await paystreamProgram.depositWithUI(
          vaultTitle === "USDC" ? usdcConfig : solConfig,
          amountBN,
        );
        console.log("worked", result);
        toast.success("Deposit successful");
      } else {
        const result = await paystreamProgram.lendWithUI(
          vaultTitle === "USDC" ? usdcConfig : solConfig,
          amountBN,
          vaultTitle === "USDC" ? isP2pUsdcEnabled : isP2pSolEnabled,
        );
        console.log("worked", result);
        toast.success("Deposit successful");
      }
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error in supply:", error);

      if (
        error instanceof Error &&
        error.message.includes("borrowing can't lend")
      ) {
        toast.error("Can't borrow or lend in the same market");
      } else {
        toast.error("Deposit failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (
      !inputValue ||
      !provider ||
      !paystreamProgram ||
      !usdcMarketData ||
      !solMarketData ||
      !priceData
    )
      return;

    if (loadingMarketData) return;
    const tableData = getTableData(
      usdcMarketData,
      solMarketData,
      priceData,
      usdcProtocolMetrics!,
      solProtocolMetrics!,
    );

    const usdcData = tableData?.filter((item: any) => item.asset === "usdc");
    const solData = tableData?.filter((item: any) => item.asset === "sol");

    const availableLiq =
      vaultTitle === "SOL"
        ? solData[0]?.avl_liquidity
        : usdcData[0]?.avl_liquidity;

    if (Number(inputValue) > Number(availableLiq)) {
      return toast.error(
        "Requested amount exceeds current liquidity of market",
      );
    }

    try {
      setIsLoading(true);

      const decimals = vaultTitle === "SOL" ? LAMPORTS_PER_SOL : 1_000_000;
      const amount = new BN(Number(inputValue) * decimals);

      if (!usdcConfig || !solConfig) return;

      // Calculate required collateral
      const requiredCollateral: BN =
        vaultTitle === "USDC"
          ? await paystreamProgram.calculateRequiredCollateral(
              usdcConfig,
              amount,
              usdcConfig.collateralLtvRatio,
            )
          : await paystreamProgram.calculateRequiredCollateral(
              solConfig,
              amount,
              solConfig.collateralLtvRatio,
            );

      // Get existing collateral from the opposite market
      const existingTraderData =
        vaultTitle === "USDC"
          ? solMarketData.traders.find(
              (trader) => trader.address === provider.publicKey?.toBase58(),
            )
          : usdcMarketData.traders.find(
              (trader) => trader.address === provider.publicKey?.toBase58(),
            );

      const existingCollateral: BN =
        existingTraderData?.lending.collateral.amount || new BN(0);

      // Check if we need additional collateral
      if (existingCollateral.lt(requiredCollateral)) {
        const additionalCollateralNeeded =
          requiredCollateral.sub(existingCollateral);
        const decimalsForDisplay =
          vaultTitle === "USDC" ? LAMPORTS_PER_SOL : 1_000_000;
        const amountToShow =
          additionalCollateralNeeded.toNumber() / decimalsForDisplay;

        toast.error("You need to deposit more collateral to borrow.");
        toast.custom((t) => (
          <div className={`${t.visible ? "animate-in" : "animate-out"}`}>
            <div className="border-[0.5px] border-[#e4d8ff] bg-bg-t3 p-4 shadow-lg">
              <h3 className="font-darkerGrotesque text-lg font-bold text-[#9CE0FF]">
                Additional Collateral Required
              </h3>
              <p className="font-helvetica mt-2 text-[#EAEAEA]">
                Please deposit an additional{" "}
                {Number(amountToShow.toFixed(4)).toString()}{" "}
                {vaultTitle === "USDC" ? "SOL" : "USDC"} as collateral to
                borrow.
              </p>
            </div>
          </div>
        ));
        setIsLoading(false);
        return;
      }

      const isP2pSolEnabled = solTrader?.isP2pEnabled;
      const isP2pUsdcEnabled = usdcTrader?.isP2pEnabled;

      // Proceed with borrowing
      if (isInsufficientCollateral) {
        toast.error("Insufficient collateral");
        setIsLoading(false);
        return;
      }
      const borrowResult = await paystreamProgram.borrowWithUI(
        vaultTitle === "USDC" ? usdcConfig : solConfig,
        amount,
        vaultTitle === "USDC" ? isP2pUsdcEnabled : isP2pSolEnabled,
      );

      console.log("Borrow result:", borrowResult);
      toast.success("Borrow successful");
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error in borrow:", error);
      if (
        error instanceof Error &&
        error.message.includes("lending can't borrow")
      ) {
        toast.error("Can't borrow or lend in the same market");
      } else if (
        error instanceof Error &&
        error.message.includes(
          "expected this account to be already initialized",
        )
      ) {
        toast.custom(
          (t) => (
            <div className={`${t.visible ? "animate-in" : "animate-out"}`}>
              <div className="border-[0.5px] border-[#e4d8ff] bg-bg-t3 p-4 shadow-lg">
                <h3 className="font-darkerGrotesque text-lg font-bold text-[#9CE0FF]">
                  Seat is not allocated to this wallet
                </h3>
                <p className="font-helvetica mt-2 text-[#EAEAEA]">
                  Join the waitlist to get a seat
                </p>
                <Link href="https://t.me/paystreamfi" target="_blank">
                  <Button variant="shady" className="mt-4 w-full">
                    Join waitlist
                  </Button>
                </Link>
              </div>
            </div>
          ),
          {
            duration: 5000,
          },
        );
      } else {
        toast.error("Borrow failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!vaultTitle || !inputValue || !provider || !paystreamProgram) return;

    try {
      setIsLoading(true);
      // const marketConfig = {
      //   market: marketHeader.market,
      //   collateralMarket: marketHeader.collateralMarket,
      //   mint: marketHeader.mint,
      //   collateralMint: marketHeader.collateralMint,
      //   tokenProgram: marketHeader.tokenProgram,
      //   collateralTokenProgram: marketHeader.collateralTokenProgram,
      // };

      if (!usdcConfig || !solConfig) return;

      const decimals = vaultTitle === "SOL" ? LAMPORTS_PER_SOL : 1_000_000;
      const amount = new BN(Number(inputValue) * decimals);

      const result = await paystreamProgram.withdrawWithUI(
        vaultTitle === "USDC" ? usdcConfig : solConfig,
        amount,
        vaultTitle === "USDC" ? (usdcTokenAccountExists ?? false) : false,
      );
      console.log(result);
      toast.success("Withdrawal successful");
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error in withdraw:", error);
      toast.error("Withdrawal failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePercentageClick = (percentage: number) => {
    if (collateralBalance === null) return;
    const amount = percentage === 100 ? collateralBalance : (collateralBalance * percentage) / 100;

    const maxDecimals = vaultTitle === "SOL" ? 9 : 6;
    setInputValue(Number(amount.toFixed(maxDecimals)).toString());
  };

  const handleSupplyClick = () => {
    // if (!inputValue || Number(inputValue) === 0) {
    //   inputRef.current?.focus();
    //   return;
    // }
    // console.log("supply clicked");
    handleSupply();
  };

  const handleWithdrawClick = () => {
    // if (!inputValue || Number(inputValue) === 0) {
    //   inputRef.current?.focus();
    //   return;
    // }
    // console.log("supply clicked");
    handleWithdraw();
  };

  const handleBorrowClick = () => {
    // if (!inputValue || Number(inputValue) === 0) {
    //   inputRef.current?.focus();
    //   return;
    // }
    // console.log("supply clicked");
    handleBorrow();
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      {vaultState === "lend" && (
        <div className="flex flex-col gap-4 bg-[#9CE0FF05] p-[12px]">
          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              Supply {vaultTitle}
            </span>
              <div className="ml-auto flex items-center gap-2 font-body">
                <span className="text-sm text-[#BCEBFF80]">
                  Balance: {balance !== null ? balance : "--"} {vaultTitle}
                </span>
                <span
                  onClick={() => handlePercentageClick(50)}
                  className="cursor-pointer text-sm text-[#9CE0FF] transition-colors hover:text-[#BCEBFF]"
                >
                  50%
                </span>
                <span
                  onClick={() => handlePercentageClick(100)}
                  className="cursor-pointer text-sm text-[#9CE0FF] transition-colors hover:text-[#BCEBFF]"
                >
                  max
                </span>
              </div>
            
          </div>
          <div className="flex h-[73px] w-full items-center justify-between bg-[#000D1E80] px-[16px]">
            <div className="flex items-center gap-2">
              <Image
                src={icon}
                alt="vault"
                width={100}
                height={100}
                className="h-6 w-6"
              />
              <span className="font-body text-[20px] font-[500] uppercase text-[#EAEAEA]">
                {vaultTitle}
              </span>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                const value = e.target.value;
                // Only allow numbers and decimal point
                // eslint-disable-next-line wrap-regex
                if (value === "" || /^\d*\.?\d*$/.test(value)) {
                  setInputValue(value);
                }
              }}
              className="h-full w-full border-none bg-transparent text-right font-darkerGrotesque text-[40px] font-[400] uppercase text-[#EAEAEAA3] shadow-none outline-none focus:border-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="0"
              style={{ fontSize: "40px" }}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              Supply APY
            </span>

            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF]">
              {vaultTitle === "USDC"
                ? usdcProtocolMetrics?.protocolMetrics.depositRate?.toNumber()
                  ? (
                      usdcProtocolMetrics.protocolMetrics.depositRate.toNumber() /
                      10000
                    ).toFixed(1)
                  : "--"
                : solProtocolMetrics?.protocolMetrics.depositRate?.toNumber()
                  ? (
                      solProtocolMetrics.protocolMetrics.depositRate.toNumber() /
                      10000
                    ).toFixed(1)
                  : "--"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              Deposit Value
            </span>

            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF]">
              {vaultTitle === "USDC"
                ? inputValue && priceData?.originalMarketPrice
                  ? `$ ${Number((new BN(Number(inputValue) * 1_000_000).mul(new BN(priceData.originalMarketPrice)).div(PRICE_PRECISION).toNumber() / 1_000_000).toFixed(4))}`
                  : "--"
                : inputValue && priceData?.originalCollateralPrice
                  ? `$ ${Number((new BN(Number(inputValue) * LAMPORTS_PER_SOL).mul(new BN(priceData.originalCollateralPrice)).div(PRICE_PRECISION).toNumber() / LAMPORTS_PER_SOL).toFixed(4))}`
                  : "--"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              As Collateral
            </span>
            <div className="in-[.dark]:[--primary:var(--color-indigo-500)] in-[.dark]:[--ring:var(--color-indigo-900)] flex items-center gap-2 [--primary:var(--color-indigo-500)] [--ring:var(--color-indigo-300)]">
              <Checkbox
                id="as-collateral"
                defaultChecked={isCollateral}
                onCheckedChange={(checked) => {
                  setIsCollateral(checked === true);
                  console.log("mujhe ghar jana hai", checked);
                }}
              />
            </div>
          </div>

          {provider ? (
            <Button
              variant="shady"
              className="w-full"
              onClick={handleSupplyClick}
              disabled={
                ((isLendingDisabled ?? true) ||
                  Number(inputValue) === 0 ||
                  isInsufficientBalance) ??
                true
              }
            >
              {(() => {
                console.log("solTrader Loading", solTrader === undefined);
                console.log("usdcTrader Loading", usdcTrader === undefined);
                console.log(
                  "isLendingDisabled Loading",
                  isLendingDisabled === null,
                );
                console.log(
                  "isInsufficientBalance Loading",
                  isInsufficientBalance === null,
                );
                if (
                  solTrader === undefined ||
                  usdcTrader === undefined ||
                  isLendingDisabled === null ||
                  isInsufficientBalance === null
                ) {
                  return "Loading...";
                }
                console.log("isLendingDisabled", isLendingDisabled);
                console.log("isInsufficientBalance", isInsufficientBalance);
                if (isLendingDisabled) {
                  return "Already a borrower";
                } else if (isInsufficientBalance) {
                  return "Insufficient balance";
                }

                return "Supply";
              })()}
            </Button>
          ) : (
            <WalletMultiButton
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                backgroundColor: "#000D1E",
                color: "#9CE0FF",
                border: "1px solid #9CE0FF",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "16px",
                fontWeight: "500",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            />
          )}
        </div>
      )}

      {vaultState === "borrow" && (
        <div className="flex flex-col gap-4 bg-[#9CE0FF05] p-[12px]">
          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              Borrow {vaultTitle}
            </span>
            <div className="ml-auto flex items-center gap-2 font-body">
              <span className="text-sm text-[#BCEBFF80]">
                Collateral Balance:{" "}
                {collateralBalance !== null
                  ? Number(collateralBalance.toFixed(4)).toString()
                  : "--"}{" "}
                {vaultTitle === "SOL" ? "USDC" : "SOL"}
              </span>
              <span
                onClick={() => handlePercentageClick(50)}
                className="cursor-pointer text-sm text-[#9CE0FF] transition-colors hover:text-[#BCEBFF]"
              >
                50%
              </span>
              <span
                onClick={() => handlePercentageClick(100)}
                className="cursor-pointer text-sm text-[#9CE0FF] transition-colors hover:text-[#BCEBFF]"
              >
                max
              </span>
            </div>
          </div>
          <div className="flex h-[73px] w-full items-center justify-between bg-[#000D1E80] px-[16px]">
            <div className="flex items-center gap-2">
              <Image
                src={icon}
                alt="vault"
                width={100}
                height={100}
                className="h-6 w-6"
              />
              <span className="font-body text-[20px] font-[500] uppercase text-[#EAEAEA]">
                {vaultTitle}
              </span>
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                const value = e.target.value;
                // Only allow numbers and decimal point
                // eslint-disable-next-line wrap-regex
                if (value === "" || /^\d*\.?\d*$/.test(value)) {
                  setInputValue(value);
                }
              }}
              className="h-full w-full border-none bg-transparent text-right font-darkerGrotesque text-[40px] font-[400] uppercase text-[#EAEAEAA3] shadow-none outline-none focus:border-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="0"
              style={{ fontSize: "40px" }}
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              Supply Collateral
            </span>
            <div className="flex items-center gap-2">
              <Image
                src={
                  icon === "/optimizers/usdc.png"
                    ? "/optimizers/sol.png"
                    : "/optimizers/usdc.png"
                }
                alt="vault"
                width={100}
                height={100}
                className="h-6 w-6"
              />
              <span className="font-body text-[20px] font-[500] uppercase text-[#EAEAEA]">
                {collateralAmountToShow !== null &&
                collateralAmountToShow !== undefined &&
                collateralAmountToShow !== 0
                  ? collateralAmountToShow
                  : "--"}{" "}
                {vaultTitle === "SOL" ? "USDC" : "SOL"}
              </span>
            </div>
          </div>
          {collateralAmountToShow !== null &&
            collateralAmountToShow !== undefined &&
            collateralAmountToShow !== 0 && (
              <div className="flex items-center justify-between gap-2">
                <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
                  Collateral Balance
                </span>
                <div className="flex items-center gap-2">
                  <Image
                    src={
                      icon === "/optimizers/usdc.png"
                        ? "/optimizers/sol.png"
                        : "/optimizers/usdc.png"
                    }
                    alt="vault"
                    width={100}
                    height={100}
                    className="h-6 w-6"
                  />
                  <span
                    className={`font-body text-[12px] font-[500] uppercase ${
                      !collateralBalance ||
                      collateralBalance === 0 ||
                      collateralBalance < collateralAmountToShow
                        ? "text-red-500"
                        : collateralBalance < collateralAmountToShow * 1.1
                          ? "text-yellow-500"
                          : "text-[#EAEAEA]"
                    }`}
                  >
                    {collateralBalance !== null ? collateralBalance : "0"}{" "}
                    {vaultTitle === "SOL" ? "USDC" : "SOL"}
                  </span>
                </div>
              </div>
            )}
          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              LTV
            </span>

            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF]">
              {vaultTitle === "USDC"
                ? usdcConfig?.collateralLtvRatio?.toNumber()
                  ? Number(
                      usdcConfig.collateralLtvRatio.toNumber() / 100,
                    ).toFixed(1)
                  : "--"
                : solConfig?.collateralLtvRatio?.toNumber()
                  ? Number(
                      solConfig.collateralLtvRatio.toNumber() / 100,
                    ).toFixed(1)
                  : "--"}
              %
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              Liquidation LTV
            </span>

            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF]">
              {vaultTitle === "USDC"
                ? usdcConfig?.collateralLiquidationThreshold?.toNumber()
                  ? Number(
                      usdcConfig.collateralLiquidationThreshold.toNumber() /
                        100,
                    ).toFixed(1)
                  : "--"
                : solConfig?.collateralLiquidationThreshold?.toNumber()
                  ? Number(
                      solConfig.collateralLiquidationThreshold.toNumber() / 100,
                    ).toFixed(1)
                  : "--"}
              %
            </span>
          </div>

          {vaultState === "borrow" && provider ? (
            <Button
              variant="shady"
              className="w-full"
              onClick={handleBorrowClick}
              disabled={
                ((isBorrowDisabled ?? true) ||
                  Number(inputValue) === 0 ||
                  isInsufficientCollateral) ??
                true
              }
            >
              {(() => {
                console.log(
                  "isBorrowDisabled Loading",
                  isBorrowDisabled === null,
                );
                console.log(
                  "isInsufficientCollateral Loading",
                  isInsufficientCollateral === null,
                );
                console.log("solTrader Loading", solTrader === undefined);
                console.log("usdcTrader Loading", usdcTrader === undefined);
                if (
                  solTrader === undefined ||
                  usdcTrader === undefined ||
                  isBorrowDisabled === null
                ) {
                  return "Loading...";
                }
                console.log("isBorrowDisabled", isBorrowDisabled);
                console.log(
                  "isInsufficientCollateral",
                  isInsufficientCollateral,
                );
                if (isBorrowDisabled) {
                  return "Already a lender";
                } else if (isInsufficientCollateral) {
                  return "Insufficient collateral";
                }

                return "Borrow";
              })()}
            </Button>
          ) : (
            <WalletMultiButton
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                backgroundColor: "#000D1E",
                color: "#9CE0FF",
                border: "1px solid #9CE0FF",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "16px",
                fontWeight: "500",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            />
          )}
        </div>
      )}
    </>
  );
}
