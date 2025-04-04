import MaxWidthWrapper from "@/components/max-width-wrapper";
import KaminoHero from "@/components/optimizer-page/kamino/hero";
import { HydrateClient } from "@/trpc/server";

export default function MarginfiPage() {
  return (
    <HydrateClient>
      <MaxWidthWrapper>
        <KaminoHero />
      </MaxWidthWrapper>
    </HydrateClient>
  );
}
