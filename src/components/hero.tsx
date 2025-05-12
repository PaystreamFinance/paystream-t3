"use client";

import { motion } from "motion/react";
import Image from "next/image";
import React from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WaitlistDialog } from "./waitlist-dialog";

const Hero: React.FC = () => {
  return (
    <>
      <Image
        src="/hero/top-left-gradient.svg"
        width={532}
        height={493}
        className="pointer-events-none absolute -left-[8rem] -top-[10rem] z-0 select-none object-cover sm:-left-[15rem] md:-top-[15rem]"
        alt="hero-lines"
      />

      <main className="relative flex min-h-[968px] w-full flex-col items-start justify-start border-border-t3 text-white sm:border-x">
        <div className="relative mt-4 h-[580px] w-full xl:mt-5">
          <Image
            src="/hero/lines.svg"
            fill
            className="pointer-events-none z-0 select-none object-cover"
            alt="hero-lines"
          />
        </div>

        <motion.div
          animate={{
            x: [0, 10, 0],
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="pointer-events-none absolute -left-12 top-20 z-0 h-[112px] w-[107px] select-none"
        >
          <Image src="/hero/coin-left.svg" fill className="" alt="coin-right" />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute -right-12 top-20 z-0 hidden h-[112px] w-[107px] select-none lg:block"
          animate={{
            x: [0, 12, 0],
            y: [0, 12, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <Image
            src="/hero/coin-right.svg"
            fill
            className=""
            alt="coin-right"
          />
        </motion.div>

        <div className="z-10 -mt-[20rem] flex w-full flex-col items-center justify-center md:-mt-[16rem]">
          <h1 className="font-darkGrotesque text-center text-[42px] font-normal leading-[1.1] text-[#EAEAEA] lg:text-[64px]">
            Smarter lending, <br />{" "}
            <span className="text-nowrap font-ibmPlexSerif font-normal italic">
              {" "}
              Easier borrowing
            </span>
          </h1>
          <p className="mt-3 text-center text-sm font-normal leading-[19.44px] tracking-[1%] text-[#FFFFFF3D] lg:text-lg">
            Automatic rate optimization for lenders and <br /> borrowers. Match
            with the perfect rates.
          </p>

          <WaitlistDialog />
        </div>
      </main>
    </>
  );
};

export default Hero;
