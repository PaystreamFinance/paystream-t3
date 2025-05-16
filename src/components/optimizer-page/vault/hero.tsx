"use client";

import { VaultGraph } from "./graph";
import VaultActions from "./vault-actions";

import { Button } from "@/components/ui/button";
import { SOL_HEADER_INDEX, USDC_HEADER_INDEX } from "@/constants";
import { useMarketData } from "@/hooks/useMarketData";
import { getDriftStats, getTableData } from "@/lib/data";
import { useVaultStateStore } from "@/store/vault-state-store";
import { AnchorProvider } from "@coral-xyz/anchor";
import {
  MarketHeader,
  type MarketHeaderWithPubkey,
  PaystreamV1Program,
} from "@meimfhd/paystream-v1";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import Link from "next/link";
import { useEffect, useState } from "react";
import StatsGrid, { StatsGridHorizontal } from "./stats-grid";
import VaultDropdown from "./vault-dropdown";
import { bnToNumber } from "@/lib/contract";

export interface VaultDataProps {
  vaultTitle: string;
  icon: string;
}

interface UserData {
  myPositions: string;
  apy: string;
  projectedEarnings: string;
  p2pApy?: string;
}

export default function VaultHero({ vaultTitle, icon }: VaultDataProps) {
  const { publicKey, connected } = useWallet();
  const wallet = useAnchorWallet();

  const { connection } = useConnection();

  const [marketHeader, setMarketHeader] =
    useState<MarketHeaderWithPubkey | null>(null);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [stats, setStats] = useState<{
    totalDeposits: string;
    liquidity: string;
    apy: string;
  } | null>(null);

  const {
    usdcMarketData,
    solMarketData,
    priceData,
    loading,
    error,
    usdcProtocolMetrics,
    solProtocolMetrics,
  } = useMarketData(
    new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
    new PublicKey("So11111111111111111111111111111111111111112"),
    new PublicKey("CCQXHfu51HEpiaegMU2kyYZK7dw1NhNbAX6cV44gZDJ8"),
    new PublicKey("GSjnD3XA1ezr7Xew3PZKPJdKGhjWEGefFFxXJhsfrX5e"),
  );

  const { vaultState } = useVaultStateStore();

  useEffect(() => {
    if (vaultTitle === "SOL") {
      setStats({
        totalDeposits:
          solMarketData?.stats.deposits.collateralInUSD.toString() ?? "--",
        liquidity:
          solMarketData?.stats.totalLiquidityAvailableInUSD.toString() ?? "--",
        apy:
          vaultState === "lend"
            ? (bnToNumber(
                solProtocolMetrics?.protocolMetrics.depositRate,
                4,
              ).toFixed(4) ?? "--")
            : (bnToNumber(
                solProtocolMetrics?.protocolMetrics.borrowRate,
                4,
              ).toFixed(4) ?? "--"),
      });
    } else if (vaultTitle === "USDC") {
      setStats({
        totalDeposits:
          usdcMarketData?.stats.deposits.collateralInUSD.toString() ?? "--",
        liquidity:
          usdcMarketData?.stats.totalLiquidityAvailable.toString() ?? "--",
        apy:
          vaultState === "lend"
            ? (bnToNumber(
                usdcProtocolMetrics?.protocolMetrics.depositRate,
                4,
              ).toFixed(4) ?? "--")
            : (bnToNumber(
                usdcProtocolMetrics?.protocolMetrics.borrowRate,
                4,
              ).toFixed(4) ?? "--"),
      });
    }
  }, [
    usdcMarketData,
    solMarketData,
    priceData,
    usdcProtocolMetrics,
    solProtocolMetrics,
    vaultTitle,
    vaultState,
  ]);

  useEffect(() => {
    if (!wallet || !connection) return;

    const provider = new AnchorProvider(connection, wallet, {
      commitment: "processed",
    });

    const paystreamProgram = new PaystreamV1Program(provider);
    const fetchMarketHeader = async () => {
      try {
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
  }, [wallet, connection, vaultTitle]);

  useEffect(() => {
    if (!wallet || !connection) return;

    const provider = new AnchorProvider(connection, wallet, {
      commitment: "processed",
    });

    const paystreamProgram = new PaystreamV1Program(provider);
    const fetchUserData = async () => {
      if (!usdcMarketData || !solMarketData || !priceData) return;

      try {
        const tableData = getTableData(
          usdcMarketData,
          solMarketData,
          priceData,
          usdcProtocolMetrics!,
          solProtocolMetrics!,
        );

        const usdcData = tableData?.filter(
          (item: any) => item.asset === "usdc",
        );
        const solData = tableData?.filter((item: any) => item.asset === "sol");

        console.log(solData, "solData");
        console.log(usdcData, "usdcData");

        let apy;
        let p2pApy;

        if (vaultState === "lend") {
          apy =
            vaultTitle === "USDC"
              ? usdcData[0]?.supply_apr
              : solData[0]?.supply_apr;
          p2pApy =
            vaultTitle === "USDC" ? usdcData[0]?.p2p_apr : solData[0]?.p2p_apr;
        }

        if (vaultState === "borrow") {
          apy =
            vaultTitle === "USDC"
              ? usdcData[0]?.borrow_apr
              : solData[0]?.borrow_apr;
          p2pApy =
            vaultTitle === "USDC" ? usdcData[0]?.p2p_apr : solData[0]?.p2p_apr;
        }

        const userData = await paystreamProgram.getTraderPosition(
          // eslint-disable-next-line
          marketHeader?.market!,
          publicKey!,
        );

        const decimals = vaultTitle === "USDC" ? 6 : 9;
        const onVaultLendsNum =
          Number(userData?.onVaultLends?.toString() ?? "0") /
          Math.pow(10, decimals);
        const inP2pLendsNum =
          Number(userData?.inP2pLends?.toString() ?? "0") /
          Math.pow(10, decimals);

        console.log(`Vault Lends ${vaultTitle}:`, onVaultLendsNum.toFixed(4));
        console.log(`P2P Lends ${vaultTitle}:`, inP2pLendsNum.toFixed(4));

        setUserData({
          myPositions: onVaultLendsNum.toFixed(4),
          apy: apy?.toString() ?? "0",
          projectedEarnings: apy
            ? (onVaultLendsNum * (1 + apy / 100)).toFixed(4)
            : "0",
          p2pApy: p2pApy?.toString() ?? "0",
        });
      } catch (error) {
        console.info("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [
    marketHeader,
    connected,
    publicKey,
    wallet,
    connection,
    vaultTitle,
    vaultState,
    usdcMarketData,
    solMarketData,
    priceData,
    usdcProtocolMetrics,
    solProtocolMetrics,
  ]);

  return (
    <main className="relative flex min-h-[1064px] w-full flex-col items-center justify-start border-x border-b border-border-t3">
      <div className="relative flex w-full flex-col gap-4 overflow-hidden px-[46px] pt-[46px]">
        <div className="flex items-center justify-between">
          <p className="font-darkerGrotesque text-2xl font-[600] text-[#EAEAEA]">
            {vaultTitle} Vault
          </p>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button className="w-fit bg-[#9CE0FF0F] font-body text-[#9CE0FF] hover:bg-[#9CE0FF] hover:text-[#02142B]">
                Dashboard
              </Button>
            </Link>
            <VaultDropdown />
          </div>
        </div>
        <div className="grid min-h-[247px] w-full grid-cols-2 gap-4">
          <StatsGrid
            stats={{
              myPosition: userData?.myPositions ?? "--",
              apy: userData?.p2pApy ?? "--",
              projectedEarnings: userData?.projectedEarnings ?? "--",
            }}
          />
          <VaultActions vaultTitle={vaultTitle} icon={icon} />
        </div>
        <StatsGridHorizontal
          stats={
            stats ?? {
              totalDeposits: "--",
              liquidity: "--",
              apy: "--",
            }
          }
          underline={false}
        />
        <VaultGraph dataUser={{ position: userData?.myPositions ?? "--" }} />
      </div>
    </main>
  );
}
