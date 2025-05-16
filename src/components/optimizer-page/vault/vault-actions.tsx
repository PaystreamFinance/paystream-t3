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
import { useEffect, useRef, useState } from "react";
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
  const { publicKey, connected } = useWallet();
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
  const [inputValue, setInputValue] = useState("");
  const vaultState = useVaultStateStore((state) => state.vaultState);
  const [isLoading, setIsLoading] = useState(false);

  const [leverageValue, setLeverageValue] = useState(33);
  const [isDragging, setIsDragging] = useState(false);
  const [isLendingDisabled, setIsLendingDisabled] = useState<boolean | null>(
    null,
  );
  const [isBorrowDisabled, setIsBorrowDisabled] = useState<boolean | null>(
    null,
  );

  const [supplyType, setSupplyType] = useState<"p2p" | "collateral">("p2p");

  const wallet = useAnchorWallet();
  const { connection } = useConnection();

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
  } = useMarketData(
    new anchor.web3.PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
    new anchor.web3.PublicKey("So11111111111111111111111111111111111111112"),
    new anchor.web3.PublicKey("CCQXHfu51HEpiaegMU2kyYZK7dw1NhNbAX6cV44gZDJ8"),
    new anchor.web3.PublicKey("GSjnD3XA1ezr7Xew3PZKPJdKGhjWEGefFFxXJhsfrX5e"),
  );

  useEffect(() => {
    if (
      !usdcConfig ||
      !solConfig ||
      !usdcMarketData ||
      !solMarketData ||
      !wallet
    )
      return;
    const usdcTrader = usdcMarketData.traders.find(
      (trader) => trader.address === wallet.publicKey.toBase58(),
    );
    const solTrader = solMarketData.traders.find(
      (trader) => trader.address === wallet.publicKey.toBase58(),
    );
    setSolTrader(solTrader ?? null);
    setUsdcTrader(usdcTrader ?? null);

    const isBorrowDisabled =
      vaultTitle === "USDC"
        ? solTrader?.isLender === true
          ? false
          : true
        : usdcTrader?.isLender === true
          ? false
          : true;
    setIsBorrowDisabled(!isBorrowDisabled);
    const isLendingDisabled =
      (usdcTrader?.isLender === true && vaultTitle === "USDC") ||
      (solTrader?.isLender === true && vaultTitle === "SOL");
    setIsLendingDisabled(!isLendingDisabled);
  }, [
    usdcConfig,
    solConfig,
    vaultTitle,
    solMarketData,
    usdcMarketData,
    wallet,
  ]);

  useEffect(() => {
    if (!wallet || !connection) return;
    if (!paystreamProgram) return;
    console.log("paystreamProgram", paystreamProgram);

    const fetchCollateralAmount = async () => {
      if (!usdcConfig || !solConfig) return;
      console.log("fetching collateral amount");
      const decimals = vaultTitle === "SOL" ? LAMPORTS_PER_SOL : 1_000_000;
      if (vaultState === "lend" && balance && balance < Number(inputValue)) {
        setIsLendingDisabled(true);
      } else {
        setIsLendingDisabled(false);
      }
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
          ? solMarketData?.traders.find(
              (trader) => trader.address === wallet.publicKey?.toBase58(),
            )?.lending.collateral.amount
          : usdcMarketData?.traders.find(
              (trader) => trader.address === wallet.publicKey?.toBase58(),
            )?.lending.collateral.amount;
      const solTrader = solMarketData?.traders.find(
        (trader) => trader.address === wallet.publicKey?.toBase58(),
      );
      const usdcTrader = usdcMarketData?.traders.find(
        (trader) => trader.address === wallet.publicKey?.toBase58(),
      );
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
        setIsBorrowDisabled(true);
      } else {
        const isDisabled =
          vaultTitle === "USDC"
            ? solTrader?.isLender === true
              ? false
              : true
            : usdcTrader?.isLender === true
              ? false
              : true;
        setIsBorrowDisabled(!isDisabled);
      }
      setCollateralBalance(
        Number(remainingCollateralBalance) / collateralDecimals,
      );
      setCollateralAmountToShow(Number(collateralAmount) / collateralDecimals);

      console.log(collateralAmount, `collateral amount for ${vaultTitle}`);
    };

    fetchCollateralAmount();
  }, [
    inputValue,
    vaultTitle,
    wallet,
    connection,
    solMarketData,
    usdcMarketData,
    paystreamProgram,
    usdcConfig,
    solConfig,
    vaultState,
    balance,
  ]);

  // fetch wallet balance to be shown in the UI
  useEffect(() => {
    const fetchBalance = async () => {
      if (!connected || !publicKey) {
        setBalance(null);
        return;
      }

      const usdcMint = new PublicKey(
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      ); // Mainnet USDC mint address
      const tokenAccount = utils.token.associatedAddress({
        mint: usdcMint,
        owner: publicKey,
      });

      console.log(tokenAccount.toBase58(), "token account");

      const solBalance = await connection.getBalance(publicKey);

      const tokenAccountInfo = await connection.getAccountInfo(tokenAccount);
      setUsdcTokenAccountExists(tokenAccountInfo ? true : false);
      const tokenAccounts = tokenAccountInfo
        ? await connection.getTokenAccountBalance(tokenAccount)
        : null;

      const usdcBalance = tokenAccounts ? tokenAccounts.value.uiAmount : null;

      try {
        if (vaultState === "lend") {
          if (vaultTitle === "SOL") {
            if (solBalance) {
              const balance = solBalance / LAMPORTS_PER_SOL;
              setBalance(balance ?? 0);
            } else {
              setBalance(0);
            }
          } else if (vaultTitle === "USDC") {
            if (usdcBalance) {
              setBalance(usdcBalance);
            } else {
              setBalance(0);
            }
          }
        }

        if (vaultState === "borrow") {
          if (vaultTitle === "USDC") {
            if (solBalance) {
              const balance = solBalance / LAMPORTS_PER_SOL;
              setBalance(balance ?? 0);
            } else {
              setBalance(0);
            }
          } else if (vaultTitle === "SOL") {
            if (usdcBalance) {
              setBalance(usdcBalance);
            } else {
              setBalance(0);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance(null);
      }
    };

    fetchBalance();
    const intervalId = setInterval(fetchBalance, 10000);

    return () => clearInterval(intervalId);
  }, [connection, publicKey, connected, vaultTitle, vaultState]);

  const handleSupply = async () => {
    if (!inputValue || !wallet || !connection || !paystreamProgram) return;

    // Check if input amount exceeds balance
    const amount = Number(inputValue);
    if (amount > (balance ?? 0)) {
      toast.error("Insufficient balance");
      setIsLendingDisabled(true);
      return;
    }
    try {
      setIsLoading(true);

      const decimals = vaultTitle === "SOL" ? LAMPORTS_PER_SOL : 1_000_000; // 9 decimals for SOL, 6 for USDC
      const amountBN = new BN(amount * decimals);

      console.log("test");
      console.log(usdcConfig?.ltvRatio, "market config");
      console.log(usdcConfig?.mint.toBase58(), "mint");
      console.log(usdcConfig?.market.toBase58(), "market");

      if (!usdcConfig || !solConfig) return;

      const isP2pSolEnabled = solMarketData?.traders.find(
        (trader) => trader.address === wallet.publicKey?.toBase58(),
      )?.isP2pEnabled;
      const isP2pUsdcEnabled = usdcMarketData?.traders.find(
        (trader) => trader.address === wallet.publicKey?.toBase58(),
      )?.isP2pEnabled;

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
      // } else if (supplyType === "collateral") {
      //   const result = await paystreamProgram.depositWithUI(
      //     marketConfig,
      //     amount,
      //   );
      //   console.log(result);
      //   toast.success("Deposit successful");
      // }
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
      !wallet ||
      !connection ||
      !paystreamProgram ||
      !usdcMarketData ||
      !solMarketData ||
      !priceData
    )
      return;

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

      // Get market price data
      const marketPriceData =
        vaultTitle === "USDC"
          ? await paystreamProgram.getMarketPriceData(usdcConfig)
          : await paystreamProgram.getMarketPriceData(solConfig);

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
          ? solMarketData?.traders.find(
              (trader) => trader.address === wallet.publicKey?.toBase58(),
            )
          : usdcMarketData?.traders.find(
              (trader) => trader.address === wallet.publicKey?.toBase58(),
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
        return;
      }
      // Calculate additional collateral needed
      // const additionalCollateral = requiredCollateral.sub(existingCollateral);
      // console.log(additionalCollateral.toString(), "additional collateral");
      // // Check user's balance for the collateral asset
      // let userBalance;
      // if (vaultTitle === "USDC") {
      //   // Need SOL as collateral
      //   userBalance = await connection.getBalance(wallet.publicKey);
      //   console.log(userBalance.toString(), "sol user balance");
      //   if (new BN(userBalance).lt(additionalCollateral)) {
      //     toast.error("Insufficient SOL balance for collateral");
      //     return;
      //   }
      // } else {
      //   // Need USDC as collateral
      //   const usdcMint = new PublicKey(
      //     "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      //   );
      //   const tokenAccount = await utils.token.associatedAddress({
      //     mint: usdcMint,
      //     owner: wallet.publicKey,
      //   });
      //   const tokenBalance =
      //     await connection.getTokenAccountBalance(tokenAccount);
      //   const usdcBalance = new BN(tokenBalance.value.amount);
      //   console.log(usdcBalance.toString(), "usdc balance");
      //   if (usdcBalance.lt(additionalCollateral)) {
      //     toast.error("Insufficient USDC balance for collateral");
      //     return;
      //   }
      // }

      // Deposit additional collateral
      // const depositResult = await paystreamProgram.depositWithUI(
      //   vaultTitle === "USDC" ? solConfig : usdcConfig,
      //   additionalCollateral,
      // );
      // toast.success("Additional collateral deposited successfully");

      const isP2pSolEnabled = solMarketData?.traders.find((trader) => {
        console.log(trader, "trader");
        console.log(wallet.publicKey?.toBase58(), "wallet");
        return trader.address === wallet.publicKey?.toBase58();
      })?.isP2pEnabled;
      const isP2pUsdcEnabled = usdcMarketData?.traders.find((trader) => {
        console.log(trader, "trader");
        console.log(wallet.publicKey?.toBase58(), "wallet");
        return trader.address === wallet.publicKey?.toBase58();
      })?.isP2pEnabled;

      // Proceed with borrowing
      const borrowResult = await paystreamProgram.borrowWithUI(
        vaultTitle === "USDC" ? usdcConfig : solConfig,
        amount,
        vaultTitle === "USDC" ? isP2pUsdcEnabled : isP2pSolEnabled,
      );

      console.log("Borrow result:", borrowResult);
      toast.success("Borrow successful");
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
    if (!vaultTitle || !inputValue || !wallet || !connection) return;

    const provider = new AnchorProvider(connection, wallet, {
      commitment: "processed",
    });
    const paystreamProgram = new PaystreamV1Program(provider);

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
        vaultTitle === "USDC" ? usdcTokenAccountExists ?? false : false,
      );
      console.log(result);
      toast.success("Withdrawal successful");
    } catch (error) {
      console.error("Error in withdraw:", error);
      toast.error("Withdrawal failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePercentageClick = (percentage: number) => {
    if (balance === null) return;
    const amount = percentage === 100 ? balance : (balance * percentage) / 100;

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
                Balance: {balance !== null ? balance.toFixed(4) : "--"}{" "}
                {vaultTitle}
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

          {connected ? (
            <Button
              variant="shady"
              className="w-full"
              onClick={handleSupplyClick}
              disabled={(isLendingDisabled ?? true) || Number(inputValue) === 0}
            >
              {(() => {
                console.log("solTrader", solTrader === undefined);
                console.log("usdcTrader", usdcTrader === undefined);
                console.log("isLendingDisabled", isLendingDisabled === null);
                if (
                  solTrader === undefined ||
                  usdcTrader === undefined ||
                  isLendingDisabled === null
                ) {
                  return "Loading...";
                }

                if (isLendingDisabled) {
                  const isLender = !(vaultTitle === "USDC"
                    ? solTrader?.isLender
                    : usdcTrader?.isLender);

                  return isLender
                    ? "Already a borrower"
                    : "Insufficient collateral";
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
                Balance: {balance !== null ? Number(balance.toFixed(4)).toString() : "--"}{" "}
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
                  ? Number(collateralAmountToShow).toFixed(5)
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
                    {collateralBalance !== null
                      ? Number(collateralBalance).toFixed(6)
                      : "0"}
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
                  ? (Number(usdcConfig.collateralLtvRatio.toNumber() / 100).toFixed(1))
                  : "--"
                : solConfig?.collateralLtvRatio?.toNumber()
                  ? (Number(solConfig.collateralLtvRatio.toNumber() / 100).toFixed(1))
                  : "--"}
              %
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              LLTV
            </span>

            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF]">
              {vaultTitle === "USDC"
                ? usdcConfig?.collateralLiquidationThreshold?.toNumber()
                  ? (Number(usdcConfig.collateralLiquidationThreshold.toNumber() / 100).toFixed(1))
                  : "--"
                : solConfig?.collateralLiquidationThreshold?.toNumber()
                  ? (Number(solConfig.collateralLiquidationThreshold.toNumber() / 100).toFixed(1))
                  : "--"}
              %
            </span>
          </div>
          {connected ? (
            <Button
              variant="shady"
              className="w-full"
              onClick={handleBorrowClick}
              disabled={(isBorrowDisabled ?? true) || Number(inputValue) === 0}
            >
              {(() => {
                if (
                  solTrader === undefined ||
                  usdcTrader === undefined ||
                  isBorrowDisabled === null
                ) {
                  return "Loading...";
                }

                if (isBorrowDisabled) {
                  const isLender =
                    vaultTitle === "USDC"
                      ? solTrader?.isLender
                      : usdcTrader?.isLender;

                  return isLender
                    ? "Already a lender"
                    : "Insufficient collateral";
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
