import { VaultGraph } from "./graph";
import VaultActions from "./vault-actions";

import StatsGrid, { StatsGridHorizontal } from "./stats-grid";
import VaultDropdown from "./vault-dropdown";

export interface VaultDataProps {
  vaultTitle: string;
  icon: string;
}

export default function VaultHero({ vaultTitle, icon }: VaultDataProps) {
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
              myPosition: "$100.0K",
              apy: "8.4",
              projectedEarnings: "$74.6K",
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
        <VaultGraph />
      </div>
    </main>
  );
}
