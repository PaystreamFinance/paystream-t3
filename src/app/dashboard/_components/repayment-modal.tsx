"use client";

import { AnchorProvider, BN } from "@coral-xyz/anchor";
import {
  calculate_debt_amount_in_collateral,
  MarketConfig,
  type MarketHeaderWithPubkey,
  PaystreamV1Program,
} from "@meimfhd/paystream-v1";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SOL_HEADER_INDEX,
  SOL_MINT,
  USDC_HEADER_INDEX,
  USDC_MINT,
} from "@/constants";

import { useMarketData } from "@/hooks/useMarketData";
import { bnToNumber } from "@/lib/contract";
import { type WithdrawModalProps } from "./withdraw-modal";
import { Clock } from "lucide-react";

const RepaymentModal: React.FC<WithdrawModalProps> = ({ row, onSuccess }) => {
  const [balance, setBalance] = React.useState<number | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [marketHeader, setMarketHeader] =
    React.useState<MarketHeaderWithPubkey | null>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [repaymentTime, setRepaymentTime] = React.useState<Date | null>(null);
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const { usdcConfig, solConfig, priceData, solMarketData, usdcMarketData, paystreamProgram } =
    useMarketData(
      new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
      new PublicKey("So11111111111111111111111111111111111111112"),
      new PublicKey("CCQXHfu51HEpiaegMU2kyYZK7dw1NhNbAX6cV44gZDJ8"),
      new PublicKey("GSjnD3XA1ezr7Xew3PZKPJdKGhjWEGefFFxXJhsfrX5e"),
    );

  const provider = new AnchorProvider(connection, wallet!, {
    commitment: "processed",
  });

  const vaultTitle = row.original.asset.toUpperCase();

  const handlePercentageClick = (percentage: number) => {
    const maxAmount = row.original.action_amount;
    const amount =
      percentage === 100 ? maxAmount : (maxAmount * percentage) / 100;

    const maxDecimals = vaultTitle === "SOL" ? 9 : 6;
    setInputValue(Number(amount.toFixed(maxDecimals)).toString());
  };

  const handleRepayment = async () => {
    if (!marketHeader || !inputValue || !paystreamProgram || !solConfig || !usdcConfig) return;

    try {
      // const marketConfig = {
      //   market: marketHeader.market,
      //   collateralMarket: marketHeader.collateralMarket,
      //   mint: marketHeader.mint,
      //   collateralMint: marketHeader.collateralMint,
      //   tokenProgram: marketHeader.tokenProgram,
      //   collateralTokenProgram: marketHeader.collateralTokenProgram,
      // };

      const decimals = vaultTitle === "SOL" ? LAMPORTS_PER_SOL : 1_000_000;
      const amount = new BN(Number(inputValue) * decimals);

      const config = vaultTitle === "SOL" ? solConfig : usdcConfig;

      const replayResult = await paystreamProgram.repayWithUI(config, amount);
      console.log(replayResult);
      toast.success("Repaid successful");
      onSuccess();
      // const result = await paystreamProgram.withdrawWithUI(
      //   config!,
      //   freeCollateral,
      // );
      // console.log(result);
      // toast.success("Withdrawal successful");
    } catch (error) {
      console.error("Error in repayment:", error);
      toast.error("Repayment failed");
    }
  };

  const handleRepaymentClick = () => {
    if (!inputValue) {
      inputRef.current?.focus();
      return;
    }
    handleRepayment();
  };

  React.useEffect(() => {
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

  React.useEffect(() => {
    const fetchMarketHeader = async () => {
      try {
        if (!paystreamProgram) return;
        const headers = await paystreamProgram.getAllMarketHeaders();
        if (vaultTitle === "SOL") {
          // headers[0] is for SOL vault
          setMarketHeader(headers[SOL_HEADER_INDEX] ?? null);
        } else if (vaultTitle === "USDC") {
          // headers[1] is for USDC vault
          setMarketHeader(headers[USDC_HEADER_INDEX] ?? null);
        }
      } catch (error) {
        console.error("Error fetching market headers:", error);
      }
    };

    fetchMarketHeader();
    if (!solMarketData || !usdcMarketData) return;
    const fetchTime = async () => {
      const time =
        vaultTitle === "SOL"
          ? solMarketData?.matches.find(
              (match) => match.borrower?.toString() === publicKey?.toString(),
            )?.timestamp
          : usdcMarketData?.matches.find(
              (match) => match.borrower?.toString() === publicKey?.toString(),
            )?.timestamp;
      setRepaymentTime(time ?? null);
    };

    fetchTime();
  }, [publicKey, vaultTitle, solMarketData, usdcMarketData, paystreamProgram]);

  return (
    <div>
      <div className="flex flex-col gap-4 bg-[#070f14] p-[12px]">
        <div className="flex items-center justify-between gap-2">
          <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
            Repayment {row.original.asset}
          </span>
          <div className="ml-auto flex items-center gap-2 font-body">
            <span className="text-sm text-[#BCEBFF80]">
              Pending:{" "}
              {Number(row.original.action_amount.toFixed(4))} {vaultTitle}
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
        <div className="flex h-[73px] w-full items-center justify-between rounded-md bg-[#02152A] px-[16px]">
          <div className="flex items-center gap-2">
            <Image
              src={`/optimizers/${row.original.asset}.png`}
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
        {/* <div className="flex items-center justify-between gap-2">
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
        </div> */}
        <Badge className="mb-5 flex w-full items-center justify-center gap-2 border border-[#9CE0FF33] bg-[#000D1E80] px-4 py-3 text-sm font-medium text-[#9CE0FF] hover:bg-[#000D1E80]">
          <Clock className="h-4 w-4" />
          <div className="flex items-center gap-2">
            <span className="font-mono">
              {repaymentTime
                ? `${Math.ceil((Date.now() - repaymentTime.getTime()) / (1000 * 60 * 60 * 24))} days`
                : "0 days"}
            </span>
            <span className="font-mono text-[#9CE0FF80]">|</span>
            <span className="font-mono">
              {repaymentTime
                ? `${Math.ceil((Date.now() - repaymentTime.getTime()) / (1000 * 60 * 60))} hours`
                : "0 hours"}
            </span>
          </div>
        </Badge>

        {connected ? (
          <Button
            variant="shady"
            className="w-full"
            onClick={handleRepaymentClick}
          >
            Repayment
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
    </div>
  );
};

export default RepaymentModal;
