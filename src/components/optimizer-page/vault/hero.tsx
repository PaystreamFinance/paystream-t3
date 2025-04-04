"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";

import { VaultGraph } from "./graph";
import StatsGrid, { StatsGridHorizontal } from "./stats-grid";
import VaultActions from "./vault-actions";
import VaultDropdown from "./vault-dropdown";

export interface VaultDataProps {
  vaultTitle: string;
  icon: string;
}

export default function VaultHero({ vaultTitle, icon }: VaultDataProps) {
  const { publicKey } = useWallet();

  const { data: userData } = api.drift.getUserData.useQuery({
    publicKey: publicKey?.toString()!,
    vaultTitle: vaultTitle as "USDC" | "SOL",
  });

  if (!publicKey) {
    return (
      <main className="relative flex min-h-[1064px] w-full flex-col items-center justify-start border-x border-b border-border-t3">
        <div className="relative flex w-full items-center justify-center gap-4 overflow-hidden px-[46px] pt-[46px]">
          <p className="font-darkerGrotesque text-2xl font-[600] text-[#EAEAEA]">
            Connect your wallet.
          </p>
        </div>
      </main>
    );
  }

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
              myPosition: userData?.myPositions ?? "-",
              apy: userData?.apy ?? "-",
              projectedEarnings: userData?.projectedEarnings ?? "-",
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
        <VaultGraph dataUser={{ position: userData?.myPositions ?? "-" }} />
      </div>
    </main>
  );
}
