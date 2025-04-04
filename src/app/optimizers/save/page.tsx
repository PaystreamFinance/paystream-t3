import MaxWidthWrapper from "@/components/max-width-wrapper";
import SaveHero from "@/components/optimizer-page/save/hero";
import { HydrateClient } from "@/trpc/server";

export default function MarginfiPage() {
  return (
    <HydrateClient>
      <MaxWidthWrapper>
        <SaveHero />
      </MaxWidthWrapper>
    </HydrateClient>
  );
}
