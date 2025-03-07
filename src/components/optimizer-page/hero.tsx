import Image from "next/image";
import React from "react";

import { Button } from "@/components/ui/button";
import Carousel from "./carousel";
import Stats from "./stats";
const Hero: React.FC = () => {
  return (
    <>
      <main className="relative flex min-h-[842px] w-full flex-col items-start justify-between border-x border-border-t3 text-white">
        <div className="mt-20 flex w-full flex-col items-center justify-center gap-[60px]">
          <h1 className="text-center text-[64px] font-thin leading-[1.1] text-[#EAEAEA]">
            Choose your <br />
            <span className="font-ibmPlexSerif font-normal italic">
              optimizer
            </span>
          </h1>
          <Carousel />
        </div>
        <Stats />
      </main>
    </>
  );
};

export default Hero;
