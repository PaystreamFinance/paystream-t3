"use client";

import Image from "next/image";
import React from "react";
import Marquee from "react-fast-marquee";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tabs = "lenders" | "borrowers" | "protocols" | "daos";

const PaymentSolution: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState<Tabs>("lenders");

  return (
    <div className="relative border-x border-border-t3 py-56">
      <Image
        src="/payment/middle-gradient.svg"
        className="pointer-events-none absolute -right-[30rem] -top-[16rem] z-0 select-none"
        width={1200}
        height={375}
        alt="middle-gradient"
      />

      <h1 className="text-center text-[64px] font-thin leading-[1.1] text-[#EAEAEA]">
        Payment solutions <br />{" "}
        <span className="font-ibmPlexSerif font-normal italic">
          {" "}
          For everyone
        </span>
      </h1>

      <div className="mt-8 flex w-full items-center justify-center gap-3">
        <Button
          variant="ghost"
          className={cn(
            selectedTab === "lenders" && "!h-9 bg-[#BCEBFF] text-[#02142B]",
          )}
          onClick={() => setSelectedTab("lenders")}
        >
          Lenders
        </Button>
        <Button
          variant="ghost"
          className={cn(
            selectedTab === "borrowers" && "!h-9 bg-[#BCEBFF] text-[#02142B]",
          )}
          onClick={() => setSelectedTab("borrowers")}
        >
          Borrowers
        </Button>
        <Button
          variant="ghost"
          className={cn(
            selectedTab === "protocols" && "!h-9 bg-[#BCEBFF] text-[#02142B]",
          )}
          onClick={() => setSelectedTab("protocols")}
        >
          Protocols
        </Button>
        <Button
          variant="ghost"
          className={cn(
            selectedTab === "daos" && "!h-9 bg-[#BCEBFF] text-[#02142B]",
          )}
          onClick={() => setSelectedTab("daos")}
        >
          DAOs & Teams
        </Button>
      </div>

      <div className="mt-8 flex w-full flex-col items-center justify-center">
        <div className="h-[65px] w-px rounded-full bg-[#9CE0FF33]" />
        <div className="h-px w-[70px] rounded-full bg-[#9CE0FF4D]" />

        <div className="my-6 flex w-full max-w-[350px] flex-col items-start justify-center gap-4">
          <h5 className="font-ibmPlexSerif text-2xl font-medium italic text-[#BCEBFF]">
            Your capital never sleeps.
          </h5>
          <p className="font-normal leading-[17.6px] text-[#BCEBFF99]">
            Instead of relying solely on volatile DEX fees, your funds are
            matched with borrowers directly at optimized rates. If no match is
            found, they continue earning through Kamino and Marginfi, ensuring
            that your capital never sleeps.
          </p>
          <div className="-ml-5 mt-3 w-full max-w-[360px] [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
            <Marquee direction="left" speed={30} loop={0} className="w-fit">
              <Badge variant="apy" className="mx-2">
                3.9% APY
              </Badge>
              <Badge variant="apy" className="mx-2">
                4% APY
              </Badge>
              <Badge variant="apy" className="mx-2">
                4.1% APY
              </Badge>
              <Badge variant="apy" className="mx-2">
                3.8% APY
              </Badge>
            </Marquee>
          </div>
        </div>

        <div className="h-px w-[70px] rounded-full bg-[#9CE0FF4D]" />
        <div className="h-[65px] w-px rounded-full bg-[#9CE0FF33]" />
      </div>
    </div>
  );
};

export default PaymentSolution;
