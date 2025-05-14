import Hero from "@/components/optimizer-page/hero";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { api, HydrateClient } from "@/trpc/server";

export default async function Optimizers() {
  const hello = await api.post.hello({ text: "from tRPC" });

  // eslint-disable-next-line
  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <MaxWidthWrapper>
        <Hero />
      </MaxWidthWrapper>
    </HydrateClient>
  );
}
