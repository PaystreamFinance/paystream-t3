import React from "react";

import Image from "next/image";
import { Icons } from "./Icons";
import Logo from "./logo";
import MaxWidthWrapper from "./max-width-wrapper";

const Footer: React.FC = () => {
  return (
    <div className="relative h-[480px] w-full bg-[url('/footer/lines.svg')]">
      <MaxWidthWrapper className="flex flex-col items-center">
        <div className="mt-44 flex w-full items-center justify-between">
          <Logo />

          <ul className="flex items-center space-x-6 text-sm font-medium leading-[-0.1px] text-[#FFFFFF78]">
            <li className="cursor-pointer transition-all hover:text-[#9CE0FF]">
              Optimisers
            </li>
            <li className="cursor-pointer transition-all hover:text-[#9CE0FF]">
              Features
            </li>
          </ul>

          <div className="flex items-center gap-6">
            <Icons.mail className="cursor-pointer" />
            <Icons.twitter className="cursor-pointer" />
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 h-[326px] w-full select-none">
          <Image src="/footer/paystream.svg" alt="Paystream" fill />
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Footer;
