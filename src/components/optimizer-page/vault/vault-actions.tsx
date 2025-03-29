"use client";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { SOL_MINT, USDC_MINT } from "@/constants";
import { useVaultStateStore } from "@/store/vault-state-store";
import { AnchorProvider, BN } from "@coral-xyz/anchor";
import {
  _PaystreamV1Idl,
  MarketHeaderWithPubkey,
  PaystreamV1Program,
} from "@meimfhd/paystream-v1";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { VaultDataProps } from "./hero";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton,
    ),
  { ssr: false },
);

export default function VaultActions({ vaultTitle, icon }: VaultDataProps) {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const { vaultState, setVaultState } = useVaultStateStore();
  const [leverageValue, setLeverageValue] = useState(33);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const [supplyType, setSupplyType] = useState<"p2p" | "collateral">("p2p");

  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const [marketHeader, setMarketHeader] =
    useState<MarketHeaderWithPubkey | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const provider = new AnchorProvider(connection, wallet!, {});
  const paystreamProgram = new PaystreamV1Program(provider);

  useEffect(() => {
    const fetchMarketHeader = async () => {
      try {
        const headers = await paystreamProgram.getAllMarketHeaders();
        if (vaultTitle === "SOL") {
          // headers[0] is for SOL vault
          setMarketHeader(headers[1] ?? null);
        } else if (vaultTitle === "USDC") {
          // headers[1] is for USDC vault
          setMarketHeader(headers[0] ?? null);
        }
      } catch (error) {
        console.error("Error fetching market headers:", error);
      }
    };

    fetchMarketHeader();
  }, []);

  const handleSupply = async () => {
    if (!marketHeader || !inputValue) return;

    try {
      const marketConfig = {
        market: marketHeader.market,
        collateralMarket: marketHeader.collateralMarket,
        mint: marketHeader.mint,
        collateralMint: marketHeader.collateralMint,
        tokenProgram: marketHeader.tokenProgram,
        collateralTokenProgram: marketHeader.collateralTokenProgram,
      };

      const decimals = vaultTitle === "SOL" ? LAMPORTS_PER_SOL : 1_000_000; // 9 decimals for SOL, 6 for USDC
      const amount = new BN(Number(inputValue) * decimals);

      if (supplyType === "p2p") {
        const result = await paystreamProgram.lendWithUI(marketConfig, amount);
        console.log(result);
        toast.success("Deposit successful");
      } else if (supplyType === "collateral") {
        const result = await paystreamProgram.depositWithUI(
          marketConfig,
          amount,
        );
        console.log(result);
        toast.success("Deposit successful");
      }
    } catch (error) {
      console.error("Error in supply:", error);
      toast.error("Deposit failed");
    }
  };

  const handleBorrow = async () => {
    if (!marketHeader || !inputValue) return;

    try {
      const marketConfig = {
        market: marketHeader.market,
        collateralMarket: marketHeader.collateralMarket,
        mint: marketHeader.mint,
        collateralMint: marketHeader.collateralMint,
        tokenProgram: marketHeader.tokenProgram,
        collateralTokenProgram: marketHeader.collateralTokenProgram,
      };

      const decimals = vaultTitle === "SOL" ? LAMPORTS_PER_SOL : 1_000_000;
      const amount = new BN(Number(inputValue) * decimals);

      const result = await paystreamProgram.borrowWithUI(marketConfig, amount);
      console.log(result);
      toast.success("Borrow successful");
    } catch (error) {
      console.error("Error in borrow:", error);
      toast.error("Borrow failed");
    }
  };

  const handleWithdraw = async () => {
    if (!marketHeader || !inputValue) return;

    try {
      const marketConfig = {
        market: marketHeader.market,
        collateralMarket: marketHeader.collateralMarket,
        mint: marketHeader.mint,
        collateralMint: marketHeader.collateralMint,
        tokenProgram: marketHeader.tokenProgram,
        collateralTokenProgram: marketHeader.collateralTokenProgram,
      };

      const decimals = vaultTitle === "SOL" ? LAMPORTS_PER_SOL : 1_000_000;
      const amount = new BN(Number(inputValue) * decimals);

      const result = await paystreamProgram.withdrawWithUI(
        marketConfig,
        amount,
      );
      console.log(result);
      toast.success("Withdrawal successful");
    } catch (error) {
      console.error("Error in withdraw:", error);
      toast.error("Withdrawal failed");
    }
  };

  // fetch wallet balance to be shown in the UI
  useEffect(() => {
    const fetchBalance = async () => {
      if (!connected || !publicKey) {
        setBalance(null);
        return;
      }

      try {
        if (vaultTitle === "SOL") {
          const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
            publicKey,
            {
              mint: new PublicKey(SOL_MINT),
            },
          );
          if (tokenAccounts.value.length > 0) {
            const balance =
              tokenAccounts.value[0]?.account.data.parsed.info.tokenAmount
                .uiAmount;
            setBalance(balance ?? 0);
          } else {
            setBalance(0);
          }
        } else if (vaultTitle === "USDC") {
          const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
            publicKey,
            {
              mint: new PublicKey(USDC_MINT),
            },
          );
          if (tokenAccounts.value.length > 0) {
            const balance =
              tokenAccounts.value[0]?.account.data.parsed.info.tokenAmount
                .uiAmount;
            setBalance(balance ?? 0);
          } else {
            setBalance(0);
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
  }, [connection, publicKey, connected, vaultTitle]);

  const handlePercentageClick = (percentage: number) => {
    if (balance === null) return;
    const amount = percentage === 100 ? balance : (balance * percentage) / 100;

    const maxDecimals = vaultTitle === "SOL" ? 9 : 6;
    setInputValue(amount.toFixed(maxDecimals));
  };

  const handleSupplyClick = () => {
    if (!inputValue) {
      inputRef.current?.focus();
      return;
    }
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
      {vaultState === "supply" && (
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

          <RadioGroup
            defaultValue="p2p"
            value={supplyType}
            onValueChange={(val) => setSupplyType(val as "p2p" | "collateral")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="p2p"
                id="p2p"
                className="border-[#9CE0FF]"
              />
              <Label
                htmlFor="p2p"
                className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF]"
              >
                P2P Lending
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="collateral"
                id="collateral"
                className="border-[#9CE0FF]"
              />
              <Label
                htmlFor="collateral"
                className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF]"
              >
                Collateral
              </Label>
            </div>
          </RadioGroup>
          {connected ? (
            <Button
              variant="shady"
              className="w-full"
              onClick={handleSupplyClick}
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

      {/* {vaultState === "withdraw" && (
        <div className="flex flex-col gap-4 bg-[#9CE0FF05] p-[12px]">
          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              Withdraw {vaultTitle}
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
              Transaction Settings
            </span>

            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF]">
              Normal
            </span>
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
          <Badge className="w-full border border-[#BBEBFF]/40 bg-[#08192A] px-3 py-2 text-sm text-amber-600 hover:bg-[#08192A]">
            Withdrawal period: 7 days
          </Badge>
          {connected ? (
            <Button
              variant="shady"
              className="w-full"
              onClick={handleWithdrawClick}
            >
              Withdraw
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
      )} */}

      {vaultState === "borrow" && (
        <div className="flex flex-col gap-4 bg-[#9CE0FF05] p-[12px]">
          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              Borrow {vaultTitle}
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
                {vaultTitle === "SOL" ? "USDC" : "SOL"}
              </span>
            </div>
          </div>
          {/* <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
                Leverage
              </span>

              <span className="font-body text-[20px] font-[500] uppercase text-[#EAEAEA]">
                {(leverageValue / 33).toFixed(1)}x
              </span>
            </div>
            <div className="relative">
              <Slider
                defaultValue={[33]}
                max={100}
                min={1}
                step={1}
                onValueChange={(value: number[]) => {
                  const newValue = value[0];
                  if (typeof newValue === "number") {
                    setLeverageValue(newValue);
                  }
                }}
                trackClassName="bg-[#9CE0FF14]"
                rangeClassName="bg-[#9CE0FFCC]"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              />
              <div
                className="absolute -top-8 rounded bg-[#000D1E] px-2 py-1 font-body text-xs text-[#9CE0FF] transition-opacity"
                style={{
                  left: `calc(${leverageValue}% - 15px)`,
                  transform: "translateX(-50%)",
                  opacity: isHovering ? 1 : 0,
                }}
              >
                {(leverageValue / 33).toFixed(1)}x
                <div className="absolute bottom-[-4px] left-1/2 h-0 w-0 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-[#000D1E]"></div>
              </div>
            </div>
          </div> */}
          {/* <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              Borrow APY
            </span>

            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF]">
              ---
            </span>
          </div> */}
          {/* <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              USDC Debt
            </span>

            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF]">
              ---
            </span>
          </div> */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              Loan-to-value Ratio
            </span>

            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF]">
              80%
            </span>
          </div>
          {connected ? (
            <Button
              variant="shady"
              className="w-full"
              onClick={handleBorrowClick}
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
