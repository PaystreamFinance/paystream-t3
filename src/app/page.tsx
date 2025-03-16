import Coins from "@/components/coins";
import Faq from "@/components/faq";
import Features from "@/components/features";
import Flexible from "@/components/flexible";
import Hero from "@/components/hero";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import PaymentSolution from "@/components/payment-solution";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <Coins />

      <MaxWidthWrapper>
        <Hero />
        <Features />
        <PaymentSolution />
        <Flexible />
        <Faq />
      </MaxWidthWrapper>
    </HydrateClient>
  );
}
