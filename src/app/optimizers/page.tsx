import MaxWidthWrapper from "@/components/max-width-wrapper";
import Hero from "@/components/optimizer-page/hero";
import { HydrateClient } from "@/trpc/server";

export default function Optimizers() {
  return (
    <HydrateClient>
      <MaxWidthWrapper>
        <Hero />
      </MaxWidthWrapper>
    </HydrateClient>
  );
}
