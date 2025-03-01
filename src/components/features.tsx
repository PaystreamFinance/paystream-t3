import React from "react";

import Image from "next/image";
import Feat1 from "./feat-1";

const Features: React.FC = () => {
  return (
    <div className="border-x border-t border-border-t3">
      <div className="flex">
        <div className="flex w-full flex-col items-start gap-6 border-r border-border-t3 px-[3.1rem] py-8">
          <div className="flex items-center gap-3 text-4xl">
            <span className="font-medium text-[#BCEBFF80]">01</span>
            <h4 className="font-thin text-[#EAEAEA]">P2P Rate Matching</h4>
          </div>
          <p className="leading-[17.28px] tracking-[-1%] text-[#FFFFFF3D]">
            Match directly with other users for better rates than traditional
            platforms. When no match is found, automatically get the best rates
            from Kamino and MarginFi. Think of it as smart routing for your
            money.
          </p>
          {/* <Feat1 /> */}
          <Image
            src="/features/feat1.svg"
            className="scale-125"
            width={361}
            height={241}
            alt="feat1"
          />
        </div>

        <div className="flex w-full flex-col items-start gap-6 px-[3.1rem] py-8">
          <div className="flex items-center gap-3 text-4xl">
            <span className="font-medium text-[#BCEBFF80]">02</span>
            <h4 className="font-thin text-[#EAEAEA]">Flexible Streaming</h4>
          </div>
          <p className="leading-[17.28px] tracking-[-1%] text-[#FFFFFF3D]">
            Pay teams, contributors, or lenders in any way that works for you.
            Daily salaries, milestone-based payments, or custom curves – all
            with minimal fees. Perfect for DAOs, startups, and organizations
            that value flexibility.
          </p>
          <Image
            src="/features/feat2.svg"
            className="scale-110"
            width={361}
            height={241}
            alt="feat1"
          />
        </div>
      </div>

      <div className="flex border-y border-border-t3">
        <div className="flex w-full max-w-[53%] flex-col items-start gap-6 px-[3.1rem] py-8">
          <div className="flex w-full items-center gap-3 text-4xl">
            <span className="font-medium text-[#BCEBFF80]">02</span>
            <h4 className="font-thin text-[#EAEAEA]">Flexible Streaming</h4>
          </div>
          <hr className="h-px w-full rounded-full border-border-t3" />
          <p className="leading-[17.28px] tracking-[-1%] text-[#FFFFFF3D]">
            Pay teams, contributors, or lenders in any way that works for you.
            Daily salaries, milestone-based payments, or custom curves – all
            with minimal fees. Perfect for DAOs, startups, and organizations
            that value flexibility.
          </p>
        </div>
        <Image
          src="/features/feat3.svg"
          className=""
          width={379}
          height={170}
          alt="feat1"
        />
      </div>
    </div>
  );
};

export default Features;
