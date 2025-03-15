import React from "react";

import Image from "next/image";
import Feat1 from "./feat-1";

const Features: React.FC = () => {
  return (
    <div className="border-x border-t border-border-t3">
      {/* First section - Mobile first with flex-col by default, row on md screens */}
      <div className="flex flex-col md:flex-row">
        <div className="flex w-full flex-col items-start gap-4 border-b border-border-t3 px-4 py-6 sm:gap-6 sm:px-6 md:border-b-0 md:border-r md:px-[3.1rem] md:py-8">
          <div className="flex items-center gap-2 text-2xl sm:gap-3 sm:text-3xl md:text-4xl">
            <span className="font-darkerGrotesque font-[400] text-[#BCEBFF80] drop-shadow-lg">
              01
            </span>
            <h4 className="font-thin text-[#EAEAEA]">P2P Rate Matching</h4>
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
              className="scale-100 sm:scale-110 md:scale-125"
              width={300}
              height={200}
              alt="P2P Rate Matching"
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-4 px-4 py-6 sm:gap-6 sm:px-6 md:px-[3.1rem] md:py-8">
          <div className="flex items-center gap-2 text-2xl sm:gap-3 sm:text-3xl md:text-4xl">
            <span className="font-darkerGrotesque font-[400] text-[#BCEBFF80] drop-shadow-lg">
              02
            </span>
            <h4 className="font-thin text-[#EAEAEA]">Flexible Streaming</h4>
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
              className="scale-100 sm:scale-110"
              width={300}
              height={200}
              alt="Flexible Streaming"
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </div>
        </div>
      </div>

      {/* Second section - Mobile first with flex-col by default, custom layout on md screens */}
      <div className="flex flex-col border-y border-border-t3 md:flex-row">
        <div className="flex w-full flex-col items-start gap-4 px-4 py-6 sm:gap-6 sm:px-6 md:max-w-[53%] md:px-[3.1rem] md:py-8">
          <div className="flex w-full items-center gap-2 text-2xl sm:gap-3 sm:text-3xl md:text-4xl">
            <span className="font-darkerGrotesque font-[400] text-[#BCEBFF80] drop-shadow-lg">
              03
            </span>
            <h4 className="font-thin text-[#EAEAEA]">Always Earning</h4>
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
            width={300}
            height={150}
            alt="Feature 3"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Features;
