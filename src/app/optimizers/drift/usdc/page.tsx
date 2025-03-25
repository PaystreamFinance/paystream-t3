import MaxWidthWrapper from "@/components/max-width-wrapper";
import VaultHero from "@/components/optimizer-page/vault/hero";
import { HydrateClient } from "@/trpc/server";

export default function VaultPage() {
  return (
    <HydrateClient>
      <MaxWidthWrapper>
        <VaultHero vaultTitle="USDC" icon="/optimizers/usdc.png" />
      </MaxWidthWrapper>
    </HydrateClient>
  );
}
