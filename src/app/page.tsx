import Image from "next/image";

import { api, HydrateClient } from "@/trpc/server";

import Features from "@/components/features";
import Hero from "@/components/hero";
import MaxWidthWrapper from "@/components/max-width-wrapper";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <div className="pointer-events-none absolute -left-4 bottom-44 z-0 h-[112px] w-[107px] select-none">
        <Image src="/hero/coin-left-2.svg" fill className="" alt="coin-right" />
      </div>

      <div className="pointer-events-none absolute -right-7 bottom-44 z-0 h-[112px] w-[107px] select-none">
        <Image
          src="/hero/coin-right-2.svg"
          fill
          className=""
          alt="coin-right"
        />
      </div>

      <MaxWidthWrapper>
        <Hero />
        <Features />
      </MaxWidthWrapper>
    </HydrateClient>
  );
}
