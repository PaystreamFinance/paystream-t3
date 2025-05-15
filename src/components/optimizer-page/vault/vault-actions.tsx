"use client";

import { Button } from "@/components/ui/button";
import * as anchor from "@coral-xyz/anchor";
import dynamic from "next/dynamic";

import LoadingOverlay from "@/components/loading-overlay";
import { Badge } from "@/components/ui/badge";
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
import { useVaultStateStore } from "@/store/vault-state-store";
import { AnchorProvider, BN, utils } from "@coral-xyz/anchor";
import {
  MarketConfig,
  MarketHeaderWithPubkey,
  PRICE_PRECISION,
  PaystreamV1Program,
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
  const [collateralAmountToShow, setCollateralAmountToShow] = useState<
    number | null
  >(null);
  const [inputValue, setInputValue] = useState("");
  const vaultState = useVaultStateStore((state) => state.vaultState);
  const [isLoading, setIsLoading] = useState(false);

  const [leverageValue, setLeverageValue] = useState(33);
  const [isDragging, setIsDragging] = useState(false);
  const [isLendingDisabled, setIsLendingDisabled] = useState(false);
  const [isBorrowDisabled, setIsBorrowDisabled] = useState(false);

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
  } = useMarketData(
    new anchor.web3.PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
    new anchor.web3.PublicKey("So11111111111111111111111111111111111111112"),
    new anchor.web3.PublicKey("CCQXHfu51HEpiaegMU2kyYZK7dw1NhNbAX6cV44gZDJ8"),
    new anchor.web3.PublicKey("GSjnD3XA1ezr7Xew3PZKPJdKGhjWEGefFFxXJhsfrX5e"),
  );

  useEffect(() => {
    if (!wallet || !connection) return;
    if (!paystreamProgram) return;

    const isDisabled =
      vaultTitle === "USDC"
        ? solMarketData?.traders.find(
            (trader) => trader.address === wallet?.publicKey?.toBase58(),
          )?.isLender
        : usdcMarketData?.traders.find(
            (trader) => trader.address === wallet?.publicKey?.toBase58(),
          )?.isLender;

    setIsBorrowDisabled(isDisabled ?? false);
    setIsLendingDisabled(!isDisabled);

    const fetchCollateralAmount = async () => {
      if (!usdcConfig || !solConfig) return;

      const decimals = vaultTitle === "SOL" ? LAMPORTS_PER_SOL : 1_000_000;
      const amount = new BN(Number(inputValue) * decimals);

      const collateralAmount =
        vaultTitle === "USDC"
          ? await paystreamProgram.calculateRequiredCollateral(
              solConfig,
              amount,
              solConfig.collateralLtvRatio,
            )
          : await paystreamProgram.calculateRequiredCollateral(
              usdcConfig,
              amount,
              usdcConfig.collateralLtvRatio,
            );

      const collateralBalance =
        vaultTitle === "USDC"
          ? solMarketData?.traders.find(
              (trader) => trader.address === wallet.publicKey?.toBase58(),
            )?.lending.collateral.amount
          : usdcMarketData?.traders.find(
              (trader) => trader.address === wallet.publicKey?.toBase58(),
            )?.lending.collateral.amount;
      console.log(collateralBalance.toString(), "collateral balance");
      // we are reversing the collateral amount because if vaultTitle is USDC, then collateral amount is in SOL
      const collateralDecimals =
        vaultTitle === "USDC" ? LAMPORTS_PER_SOL : 1_000_000;
      const balanceDecimals =
        vaultTitle === "USDC" ? 1_000_000 : LAMPORTS_PER_SOL;
      setCollateralBalance(Number(collateralBalance) / balanceDecimals);
      setCollateralAmountToShow(collateralAmount / collateralDecimals);

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
  ]);

  const handleSupply = async () => {
    if (!inputValue || !wallet || !connection) return;

    const provider = new AnchorProvider(connection, wallet, {
      commitment: "processed",
    });
    const paystreamProgram = new PaystreamV1Program(provider);
    try {
      setIsLoading(true);

      const decimals = vaultTitle === "SOL" ? LAMPORTS_PER_SOL : 1_000_000; // 9 decimals for SOL, 6 for USDC
      const amount = new BN(Number(inputValue) * decimals);
      // if (supplyType === "p2p") {
      console.log("test");
      console.log(usdcConfig?.ltvRatio, "market config");
      console.log(usdcConfig?.mint.toBase58(), "mint");
      console.log(usdcConfig?.market.toBase58(), "market");

      if (!usdcConfig || !solConfig) return;

      if (vaultTitle === "USDC") {
        const result = await paystreamProgram.lendWithUI(usdcConfig, amount);
        console.log("worked");
        console.log(result);
        toast.success("Deposit successful");
      } else if (vaultTitle === "SOL") {
        const result = await paystreamProgram.lendWithUI(solConfig, amount);
        console.log("worked");
        console.log(result);
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
    if (!inputValue || !wallet || !connection || !paystreamProgram) return;

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
      const requiredCollateral =
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
      const maxBorrowAmount = calculate_max_borrow_amount(
        existingTraderData?.lending.collateral.amount || new BN(0),
        marketPriceData.borrowPriceInCollateralMintScaled,
        vaultTitle === "SOL" ? 9 : 6,
        vaultTitle === "SOL" ? 9 : 6,
        vaultTitle === "USDC"
          ? usdcConfig.collateralLtvRatio
          : solConfig.collateralLtvRatio,
      );
      console.log(maxBorrowAmount.toString(), "max borrow amount");
      // Check if we need additional collateral
      if (existingCollateral.lt(requiredCollateral)) {
        // Calculate additional collateral needed
        const additionalCollateral = requiredCollateral.sub(existingCollateral);
        console.log(additionalCollateral.toString(), "additional collateral");
        // Check user's balance for the collateral asset
        let userBalance;
        if (vaultTitle === "USDC") {
          // Need SOL as collateral
          userBalance = await connection.getBalance(wallet.publicKey);
          console.log(userBalance.toString(), "sol user balance");
          if (new BN(userBalance).lt(additionalCollateral)) {
            toast.error("Insufficient SOL balance for collateral");
            return;
          }
        } else {
          // Need USDC as collateral
          const usdcMint = new PublicKey(
            "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          );
          const tokenAccount = await utils.token.associatedAddress({
            mint: usdcMint,
            owner: wallet.publicKey,
          });
          const tokenBalance =
            await connection.getTokenAccountBalance(tokenAccount);
          const usdcBalance = new BN(tokenBalance.value.amount);
          console.log(usdcBalance.toString(), "usdc balance");
          if (usdcBalance.lt(additionalCollateral)) {
            toast.error("Insufficient USDC balance for collateral");
            return;
          }
        }

        // Deposit additional collateral
        const depositResult = await paystreamProgram.depositWithUI(
          vaultTitle === "USDC" ? solConfig : usdcConfig,
          additionalCollateral,
        );
        toast.success("Additional collateral deposited successfully");
      }

      // Check if borrow amount is within limits
      if (amount.gt(maxBorrowAmount)) {
        toast.error(
          `Cannot borrow more than ${bnToNumber(maxBorrowAmount, vaultTitle === "SOL" ? 9 : 6)} ${vaultTitle}`,
        );
        return;
      }

      // Proceed with borrowing
      const borrowResult = await paystreamProgram.borrowWithUI(
        vaultTitle === "USDC" ? usdcConfig : solConfig,
        amount,
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
      const tokenAccount = await utils.token.associatedAddress({
        mint: usdcMint,
        owner: publicKey,
      });

      const solBalance = await connection.getBalance(publicKey);

      const tokenAccounts =
        await connection.getTokenAccountBalance(tokenAccount);

      const usdcBalance = tokenAccounts.value.uiAmount;

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
            if (tokenAccounts) {
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
            if (tokenAccounts) {
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

  const handlePercentageClick = (percentage: number) => {
    if (balance === null) return;
    const amount = percentage === 100 ? balance : (balance * percentage) / 100;

    const maxDecimals = vaultTitle === "SOL" ? 9 : 6;
    setInputValue(amount.toFixed(maxDecimals));
  };

  const handleSupplyClick = () => {
    // if (!inputValue) {
    //   inputRef.current?.focus();
    //   return;
    // }
    console.log("supply clicked");
    handleSupply();
  };

  const handleWithdrawClick = () => {
    if (!inputValue) {
      inputRef.current?.focus();
      return;
    }
    handleWithdraw();
  };

  const handleBorrowClick = () => {
    if (!inputValue) {
      inputRef.current?.focus();
      return;
    }
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
                Balance: {balance !== null ? balance.toFixed(2) : "--"}{" "}
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
              onChange={(e) => setInputValue(e.target.value)}
              className="h-full w-full border-none bg-transparent text-right font-darkerGrotesque text-[40px] font-[400] uppercase text-[#EAEAEAA3] shadow-none outline-none focus:border-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="0.0"
              style={{ fontSize: "40px" }}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              Supply APY
            </span>

            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF]">
              ---
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              Deposit Value
            </span>

            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF]">
              ---
            </span>
          </div>

          {connected ? (
            <Button
              variant="shady"
              className="w-full"
              onClick={handleSupplyClick}
              disabled={isLendingDisabled}
            >
              Supply
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
                Balance: {balance !== null ? balance.toFixed(2) : "--"}{" "}
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
              onChange={(e) => setInputValue(e.target.value)}
              className="h-full w-full border-none bg-transparent text-right font-darkerGrotesque text-[40px] font-[400] uppercase text-[#EAEAEAA3] shadow-none outline-none focus:border-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="0.0"
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
                {collateralAmountToShow !== null
                  ? Number(collateralAmountToShow).toFixed(5)
                  : "--"}{" "}
                {vaultTitle === "SOL" ? "USDC" : "SOL"}
              </span>
            </div>
          </div>
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
              <span className="font-body text-[15px] font-[500] uppercase text-[#EAEAEA]">
                {collateralBalance !== null
                  ? Number(collateralBalance).toFixed(5)
                  : "--"}{" "}
                {vaultTitle === "SOL" ? "USDC" : "SOL"}
              </span>
            </div>
          </div>
          {collateralBalance !== null &&
            collateralAmountToShow !== null &&
            collateralBalance < collateralAmountToShow && (
              <div className="flex items-center justify-between gap-2">
                <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
                  Re-margin
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
                    {(collateralAmountToShow - collateralBalance).toFixed(5)}
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
                ? usdcConfig?.collateralLtvRatio.toString()
                : (solConfig?.collateralLtvRatio.toString() ?? "--")}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              LLTV
            </span>
            {}
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF]">
              {vaultTitle === "USDC"
                ? usdcConfig?.collateralLiquidationThreshold.toString()
                : (solConfig?.collateralLiquidationThreshold.toString() ??
                  "--")}
            </span>
          </div>
          {connected ? (
            <Button
              variant="shady"
              className="w-full"
              onClick={handleBorrowClick}
              disabled={isBorrowDisabled}
            >
              Borrow
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
