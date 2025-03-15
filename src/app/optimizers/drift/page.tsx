import MaxWidthWrapper from "@/components/max-width-wrapper";
import DriftHero from "@/components/optimizer-page/drift/hero";
import { HydrateClient } from "@/trpc/server";

export default function DriftPage() {
  return (
    <HydrateClient>
      <MaxWidthWrapper>
        <DriftHero />
      </MaxWidthWrapper>
    </HydrateClient>
  );
}
