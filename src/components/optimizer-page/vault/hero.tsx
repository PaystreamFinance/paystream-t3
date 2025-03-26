"use client";

import VaultActions from "./vault-actions";
import { VaultGraph } from "./graph";

import StatsGrid, { StatsGridHorizontal } from "./stats-grid";
import VaultDropdown from "./vault-dropdown";
import { useEffect, useState } from "react";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { AnchorProvider } from "@coral-xyz/anchor";
import {
  MarketHeader,
  MarketHeaderWithPubkey,
  PaystreamV1Program,
} from "@meimfhd/paystream-v1";

export interface VaultDataProps {
  vaultTitle: string;
  icon: string;
}

interface UserData {
  myPositions: string;
  apy: string;
  projectedEarnings: string;
}

export default function VaultHero({ vaultTitle, icon }: VaultDataProps) {
  const { publicKey, connected } = useWallet();
  const wallet = useAnchorWallet();

  const { connection } = useConnection();
  const provider = new AnchorProvider(connection, wallet!, {});
  const paystreamProgram = new PaystreamV1Program(provider);

  const [marketHeader, setMarketHeader] =
    useState<MarketHeaderWithPubkey | null>(null);

  const [userData, setUserData] = useState<UserData | null>(null);

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await paystreamProgram.getTraderPosition(
          marketHeader?.market!,
          publicKey!,
        );
        const decimals = vaultTitle === "USDC" ? 6 : 9;
        const apy = vaultTitle === "USDC" ? 7.3637 : 8.4;
        const onVaultLendsNum =
          Number(userData?.onVaultLends?.toString() ?? "0") /
          Math.pow(10, decimals);
        const inP2pLendsNum =
          Number(userData?.inP2pLends?.toString() ?? "0") /
          Math.pow(10, decimals);

        console.log(`Vault Lends ${vaultTitle}:`, onVaultLendsNum.toFixed(2));
        console.log(`P2P Lends ${vaultTitle}:`, inP2pLendsNum.toFixed(2));

        setUserData({
          myPositions: onVaultLendsNum.toFixed(2),
          apy: apy.toString(),
          projectedEarnings: (onVaultLendsNum * (1 + apy / 100)).toFixed(2),
        });
      } catch (error) {
        console.info("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [marketHeader, connected, publicKey]);

  return (
    <main className="relative flex min-h-[1064px] w-full flex-col items-center justify-start border-x border-b border-border-t3">
      <div className="relative flex w-full flex-col gap-4 overflow-hidden px-[46px] pt-[46px]">
        <div className="flex items-center justify-between">
          <p className="font-darkerGrotesque text-2xl font-[600] text-[#EAEAEA]">
            {vaultTitle} Vault
          </p>
          <VaultDropdown />
        </div>
        <div className="grid min-h-[247px] w-full grid-cols-2 gap-4">
          <StatsGrid
            stats={{
              myPosition: userData?.myPositions ?? "--",
              apy: userData?.apy ?? "--",
              projectedEarnings: userData?.projectedEarnings ?? "--",
            }}
          />
          <VaultActions vaultTitle={vaultTitle} icon={icon} />
        </div>
        <StatsGridHorizontal
          stats={{
            totalDeposits: "Not available for testnet",
            liquidity: "Not available for testnet",
            apy: "Not available for testnet",
          }}
        />
        <VaultGraph dataUser={{position: userData?.myPositions ?? "--"}}/>
      </div>
    </main>
  );
}
