import MaxWidthWrapper from "@/components/max-width-wrapper";
import MarginfiHero from "@/components/optimizer-page/marginfi/hero";
import { HydrateClient } from "@/trpc/server";

export default function MarginfiPage() {
  return (
    <HydrateClient>
      <MaxWidthWrapper>
        <MarginfiHero />
      </MaxWidthWrapper>
    </HydrateClient>
  );
}
