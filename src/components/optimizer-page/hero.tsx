import Image from "next/image";
import React from "react";

import { Button } from "@/components/ui/button";
import Carousel from "./carousel";
import Stats from "./stats";

const Hero: React.FC = () => {
  return (
    <>
      <main className="relative flex min-h-[500px] w-full flex-col items-start justify-between border-x border-border-t3 px-6 text-white sm:min-h-[600px] sm:px-0 md:min-h-[700px] lg:min-h-[842px]">
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-6 sm:mt-12 sm:gap-8 md:mt-16 md:gap-10 lg:mt-20 lg:gap-[60px]">
          <h1 className="mb-8 text-center text-3xl font-thin leading-[1.1] text-[#EAEAEA] sm:mb-0 sm:text-4xl md:text-5xl lg:text-[64px]">
            Choose your <br />
            <span className="font-ibmPlexSerif font-normal italic">
              optimizer
            </span>
          </h1>

          <div className="mb-8 w-full md:hidden">
            <Stats />
          </div>

          <Carousel />
        </div>

        <div className="hidden w-full md:block">
          <Stats />
        </div>
      </main>
    </>
  );
};

export default Hero;
