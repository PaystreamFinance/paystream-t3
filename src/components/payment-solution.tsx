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
    <div
      id="payment-solutions"
      className="relative border-x border-border-t3 px-4 py-8 sm:py-16 md:py-24 lg:py-56"
    >
      <Image
        src="/payment/middle-gradient.svg"
        className="pointer-events-none absolute -right-[10rem] -top-[8rem] z-0 w-full max-w-[600px] select-none md:-right-[20rem] md:-top-[12rem] md:max-w-[800px] lg:-right-[30rem] lg:-top-[16rem] lg:max-w-[1200px]"
        width={1200}
        height={375}
        alt="middle-gradient"
      />

      <h1
        style={{
          background:
            "linear-gradient(86.43deg, #EAEAEA 64.1%, rgba(215, 79, 37, 0.6) 95.45%)",
          backgroundClip: "text",
          color: "transparent",
        }}
        className="font-darkGrotesque text-center text-3xl font-normal sm:text-4xl md:text-5xl lg:text-[64px]"
      >
        Payment solutions <br />{" "}
        <span className="font-ibmPlexSerif font-normal italic !leading-[1.17]">
          {" "}
          For everyone
        </span>
      </h1>

      <div className="mt-6 flex w-full flex-wrap items-center justify-center gap-2 sm:gap-3 md:mt-8">
        <Button
          variant="ghost"
          className={cn(
            "text-xs sm:text-sm",
            selectedTab === "lenders" &&
              "!h-8 bg-[#BCEBFF] text-[#02142B] sm:!h-9",
            "text-xs sm:text-sm",
            selectedTab === "lenders" &&
              "!h-8 bg-[#BCEBFF] text-[#02142B] sm:!h-9",
          )}
          onClick={() => setSelectedTab("lenders")}
        >
          Lenders
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "text-xs sm:text-sm",
            selectedTab === "borrowers" &&
              "!h-8 bg-[#BCEBFF] text-[#02142B] sm:!h-9",
            "text-xs sm:text-sm",
            selectedTab === "borrowers" &&
              "!h-8 bg-[#BCEBFF] text-[#02142B] sm:!h-9",
          )}
          onClick={() => setSelectedTab("borrowers")}
        >
          Borrowers
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "text-xs sm:text-sm",
            selectedTab === "protocols" &&
              "!h-8 bg-[#BCEBFF] text-[#02142B] sm:!h-9",
            "text-xs sm:text-sm",
            selectedTab === "protocols" &&
              "!h-8 bg-[#BCEBFF] text-[#02142B] sm:!h-9",
          )}
          onClick={() => setSelectedTab("protocols")}
        >
          Protocols
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "text-xs sm:text-sm",
            selectedTab === "daos" &&
              "!h-8 bg-[#BCEBFF] text-[#02142B] sm:!h-9",
            "text-xs sm:text-sm",
            selectedTab === "daos" &&
              "!h-8 bg-[#BCEBFF] text-[#02142B] sm:!h-9",
          )}
          onClick={() => setSelectedTab("daos")}
        >
          DAOs & Teams
        </Button>
      </div>

      <div className="mt-6 flex w-full flex-col items-center justify-center md:mt-8">
        <div className="h-[40px] w-px rounded-full bg-[#9CE0FF33] sm:h-[50px] md:h-[65px]" />
        <div className="h-px w-[50px] rounded-full bg-[#9CE0FF4D] sm:w-[60px] md:w-[70px]" />

        <div className="my-4 flex w-full max-w-full flex-col items-start justify-center gap-3 px-4 sm:my-5 sm:max-w-[350px] sm:px-0 md:my-6 md:gap-4">
          {selectedTab === "lenders" && (
            <>
              <h5 className="font-ibmPlexSerif text-xl font-medium italic text-[#BCEBFF] sm:text-2xl">
                Your capital never sleeps.
              </h5>
              <p className="text-sm font-normal leading-[1.4] text-[#BCEBFF99] md:text-base md:leading-[17.6px]">
                Instead of relying solely on volatile DEX fees, your funds are
                matched with borrowers directly at optimized rates. If no match
                is found, they continue earning through Kamino and Marginfi,
                ensuring that your capital never sleeps.
              </p>
              <div className="-ml-5 mt-2 w-full max-w-full [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] sm:max-w-[360px] md:mt-3">
                <Marquee direction="left" speed={30} loop={0} className="w-fit">
                  <Badge variant="apy" className="mx-2 text-xs sm:text-sm">
                    3.9% APY
                  </Badge>
                  <Badge variant="apy" className="mx-2 text-xs sm:text-sm">
                    4% APY
                  </Badge>
                  <Badge variant="apy" className="mx-2 text-xs sm:text-sm">
                    4.1% APY
                  </Badge>
                  <Badge variant="apy" className="mx-2 text-xs sm:text-sm">
                    3.8% APY
                  </Badge>
                </Marquee>
              </div>
            </>
          )}

          {selectedTab === "borrowers" && (
            <>
              <h5 className="font-ibmPlexSerif text-xl font-medium italic text-[#BCEBFF] sm:text-2xl">
                Borrow on your own terms
              </h5>
              <p className="text-sm font-normal leading-[1.4] text-[#BCEBFF99] md:text-base md:leading-[17.6px]">
                No more rigid repayment schedules. Customize your loan
                repayments with linear, milestone-based, or custom streams that
                match your cash flow. Flexible borrowing, built for startups,
                freelancers, and DAOs.
              </p>
              <div className="-ml-5 mt-2 w-full max-w-full [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] sm:max-w-[360px] md:mt-3">
                <Marquee direction="left" speed={30} loop={0} className="w-fit">
                  <Badge variant="apy" className="mx-2 text-xs sm:text-sm">
                    Linear
                  </Badge>
                  <Badge variant="apy" className="mx-2 text-xs sm:text-sm">
                    Milestone-based
                  </Badge>
                  <Badge variant="apy" className="mx-2 text-xs sm:text-sm">
                    Custom
                  </Badge>
                </Marquee>
              </div>
            </>
          )}

          {selectedTab === "protocols" && (
            <>
              <h5 className="font-ibmPlexSerif text-xl font-medium italic text-[#BCEBFF] sm:text-2xl">
                Optimize your liquidity, maximize returns.
              </h5>
              <p className="text-sm font-normal leading-[1.4] text-[#BCEBFF99] md:text-base md:leading-[17.6px]">
                Idle liquidity hurts your bottom line. PayStream redirects
                unused funds into lending opportunities, keeping capital
                productive—even during market lulls. More efficiency, better
                returns.
              </p>
              <div className="-ml-5 mt-2 w-full max-w-full [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] sm:max-w-[360px] md:mt-3">
                <Marquee direction="left" speed={30} loop={0} className="w-fit">
                  <Badge variant="apy" className="mx-2 text-xs sm:text-sm">
                    Earn interest
                  </Badge>
                  <Badge variant="apy" className="mx-2 text-xs sm:text-sm">
                    Enhance capital efficiency
                  </Badge>
                </Marquee>
              </div>
            </>
          )}

          {selectedTab === "daos" && (
            <>
              <h5 className="font-ibmPlexSerif text-xl font-medium italic text-[#BCEBFF] sm:text-2xl">
                Automate your treasury, pay seamlessly.
              </h5>
              <p className="text-sm font-normal leading-[1.4] text-[#BCEBFF99] md:text-base md:leading-[17.6px]">
                Managing contributor payments, grants, and vesting is complex.
                With PayStream, set up automated payment streams that ensure
                funds are released on time, every time.
              </p>
              <div className="-ml-5 mt-2 w-full max-w-full [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] sm:max-w-[360px] md:mt-3">
                <Marquee direction="left" speed={30} loop={0} className="w-fit">
                  <Badge variant="apy" className="mx-2 text-xs sm:text-sm">
                    Contributor salaries
                  </Badge>
                  <Badge variant="apy" className="mx-2 text-xs sm:text-sm">
                    Milestone-based grants
                  </Badge>
                </Marquee>
              </div>
            </>
          )}
        </div>

        <div className="h-px w-[50px] rounded-full bg-[#9CE0FF4D] sm:w-[60px] md:w-[70px]" />
        <div className="h-[40px] w-px rounded-full bg-[#9CE0FF33] sm:h-[50px] md:h-[65px]" />
      </div>
    </div>
  );
};

export default PaymentSolution;
