import React from "react";

import Image from "next/image";

const Features: React.FC = () => {
  return (
    <div id="features" className="border-x border-t border-border-t3">
      {/* First section - Mobile first with flex-col by default, row on md screens */}
      <div className="flex flex-col md:flex-row">
        <div className="flex w-full flex-col items-start gap-4 border-b border-border-t3 px-4 py-6 sm:gap-6 sm:px-6 md:border-b-0 md:border-r md:px-[3.1rem] md:py-8">
          <div className="font-darkGrotesque flex items-center gap-2 text-2xl sm:gap-3 sm:text-3xl md:text-4xl">
            <span className="font-medium text-[#BCEBFF80]">01</span>
            <h4 className="font-normal text-[#EAEAEA]">P2P Rate Matching</h4>
          </div>
          <p className="text-sm leading-[17.28px] tracking-[-1%] text-[#FFFFFF3D] sm:text-base">
            Match directly with other users for better rates than traditional
            platforms. When no match is found, automatically get the best rates
            from Kamino and MarginFi. Think of it as smart routing for your
            money.
          </p>
          {/* <Feat1 /> */}
          <div className="flex w-full justify-center md:justify-start">
            <Image
              src="/features/feat1.svg"
              className="mx-auto sm:scale-110 md:scale-150"
              width={300}
              height={200}
              alt="P2P Rate Matching"
            />
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-4 px-4 py-6 sm:gap-6 sm:px-6 md:px-[3.1rem] md:py-8">
          <div className="font-darkGrotesque flex items-center gap-2 text-2xl font-medium sm:gap-3 sm:text-3xl md:text-4xl">
            <span className="font-medium text-[#BCEBFF80]">02</span>
            <h4 className="font-normal text-[#EAEAEA]">Flexible Streaming</h4>
          </div>
          <p className="text-sm leading-[17.28px] tracking-[-1%] text-[#FFFFFF3D] sm:text-base">
            Pay teams, contributors, or lenders in any way that works for you.
            Daily salaries, milestone-based payments, or custom curves – all
            with minimal fees. Perfect for DAOs, startups, and organizations
            that value flexibility.
          </p>
          <div className="flex w-full justify-center md:justify-start">
            <Image
              src="/features/feat2.svg"
              className="mx-auto scale-100 sm:scale-125"
              width={300}
              height={200}
              alt="Flexible Streaming"
            />
          </div>
        </div>
      </div>

      {/* Second section - Mobile first with flex-col by default, custom layout on md screens */}
      <div className="flex flex-col border-y border-border-t3 py-1.5 md:flex-row">
        <div className="flex w-full flex-col items-start gap-4 px-4 py-6 sm:gap-6 sm:px-6 md:max-w-[53%] md:px-[3.1rem] md:py-8">
          <div className="font-darkGrotesque flex w-full items-center gap-2 text-2xl sm:gap-3 sm:text-3xl md:text-4xl">
            <span className="font-[400] text-[#BCEBFF80] drop-shadow-lg">
              03
            </span>
            <h4 className="font-normal text-[#EAEAEA]">Always Earning</h4>
          </div>
          <hr className="h-px w-full rounded-full border-border-t3" />
          <p className="text-sm leading-[17.28px] tracking-[-1%] text-[#FFFFFF3D] sm:text-base">
            Your capital never sits idle. When P2P matches aren't available,
            your funds automatically earn from established protocols. It's like
            having a smart manager for your crypto, always finding the best
            opportunities.
          </p>
        </div>
        <div className="flex w-full justify-center md:justify-start">
          <Image
            src="/features/feat3.svg"
            className="scale-105"
            width={379}
            height={170}
            alt="Feature 3"
          />
        </div>
      </div>
    </div>
  );
};

export default Features;
