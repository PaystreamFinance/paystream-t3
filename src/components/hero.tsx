import Image from "next/image";
import React from "react";

import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  return (
    <>
      <Image
        src="/hero/top-left-gradient.svg"
        width={532}
        height={493}
        className="pointer-events-none absolute -left-[15rem] -top-[15rem] z-0 select-none object-cover"
        alt="hero-lines"
      />

      <main className="relative flex min-h-[968px] w-full flex-col items-start justify-start border-x border-border-t3 text-white">
        <div className="relative mt-4 h-[580px] w-full xl:mt-5">
          <Image
            src="/hero/lines.svg"
            fill
            className="pointer-events-none z-0 select-none object-cover"
            alt="hero-lines"
          />
        </div>

        <div className="pointer-events-none absolute -left-12 top-20 z-0 h-[112px] w-[107px] select-none">
          <Image src="/hero/coin-left.svg" fill className="" alt="coin-right" />
        </div>

        <div className="pointer-events-none absolute -right-12 top-20 z-0 h-[112px] w-[107px] select-none">
          <Image
            src="/hero/coin-right.svg"
            fill
            className=""
            alt="coin-right"
          />
        </div>

        <div className="z-10 -mt-[16rem] flex w-full flex-col items-center justify-center">
          <h1 className="text-center text-[64px] font-thin leading-[1.1] text-[#EAEAEA]">
            Smarter lending, <br />{" "}
            <span className="font-ibmPlexSerif font-normal italic">
              {" "}
              Easier borrowing
            </span>
          </h1>
          <p className="mt-3 text-center text-lg font-normal leading-[19.44px] tracking-[1%] text-[#FFFFFF3D]">
            Automatic rate optimization for lenders and <br /> borrowers. Match
            with the perfect rates.
          </p>

          <Button variant="shady" className="mt-7">
            Join Waitlist
          </Button>
        </div>
      </main>
    </>
  );
};

export default Hero;
