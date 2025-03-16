"use client";

import { motion } from "motion/react";
import Image from "next/image";
import React from "react";

const Coins: React.FC = () => {
  return (
    <>
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
        className="pointer-events-none absolute -left-4 bottom-44 z-0 h-[112px] w-[107px] select-none"
      >
        <Image src="/hero/coin-left-2.svg" fill className="" alt="coin-right" />
      </motion.div>

      <motion.div
        animate={{
          x: [0, 10, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="pointer-events-none absolute -right-7 bottom-44 z-0 h-[112px] w-[107px] select-none"
      >
        <Image
          src="/hero/coin-right-2.svg"
          fill
          className=""
          alt="coin-right"
        />
      </motion.div>
    </>
  );
};

export default Coins;
