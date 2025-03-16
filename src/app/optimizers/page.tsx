import Hero from "@/components/optimizer-page/hero";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { api, HydrateClient } from "@/trpc/server";
import { CommingSoonPage } from "@/components/comming-soon-page";
export default async function Optimizers() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <CommingSoonPage />
    // <HydrateClient>
    //   <MaxWidthWrapper>
    //     <Hero />
    //   </MaxWidthWrapper>
    // </HydrateClient>
  );
}
