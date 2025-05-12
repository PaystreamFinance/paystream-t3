import Image from "next/image";
import Link from "next/link";
import React from "react";

import MaxWidthWrapper from "./max-width-wrapper";

const Footer: React.FC = () => {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute bottom-0 -z-10 h-[400px] w-full select-none sm:h-[500px] md:h-[600px]">
        <Image
          src="/footer/lines.svg"
          alt="Lines"
          fill
          className="object-cover"
        />
      </div>
      <MaxWidthWrapper className="flex flex-col items-center">
        <div className="mb-36 grid w-full grid-cols-1 divide-y divide-border-t3 border border-border-t3 bg-bg-t3 sm:mb-64 md:mt-2 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {/* First column */}
          <div className="flex flex-col items-start justify-between gap-6 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#9FB2C2]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M9.33333 1.33334L2.66667 9.33334H8L6.66667 14.6667L13.3333 6.66667H8L9.33333 1.33334Z"
                  fill="#000D1E"
                  stroke="#000D1E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="mt-auto flex w-full flex-row items-center justify-start gap-5 text-sm text-[#BCEBFF99]">
              <Link href="/support">Support</Link>
              <Link href="/tos">Terms of service</Link>
              <Link href="/legal">License</Link>
            </div>
          </div>

          {/* Second column */}
          <div className="flex items-start justify-start p-6 lg:flex-col lg:items-start lg:justify-between lg:gap-6">
            <div className="flex w-full flex-col items-start justify-start gap-3 text-[#BCEBFF99]">
              <Link href="/#features">What</Link>
              <Link href="#" target="_blank">
                How to earn?
              </Link>
              <Link href="/#payment-solutions">Benefits</Link>
              <Link href="/whitepaper.pdf" target="_blank">
                Docs
              </Link>
            </div>
            <div className="mb-auto flex w-full flex-row items-end justify-end gap-6 text-[#BCEBFF99] lg:mt-auto lg:items-start lg:justify-start">
              <Link href="https://x.com/Paystream_" target="_blank">
                <Image
                  src="/social/x-com.svg"
                  alt="Twitter"
                  width={24}
                  height={24}
                  className="cursor-pointer"
                />
              </Link>
{/*               <Link href="https://discord.gg/X7TyWfZW" target="_blank">
                <Image
                  src="/social/discord.svg"
                  alt="Discord"
                  width={24}
                  height={24}
                  className="cursor-pointer"
                />
              </Link> */}
            </div>
          </div>

          {/* Third column */}
          <div className="flex flex-col items-start justify-between gap-6 p-6 lg:flex-col lg:items-start lg:justify-between lg:gap-6">
            <div className="flex w-full flex-row items-start justify-start text-[#BCEBFF99]">
              <p>Smarter Lending, Easier Borrowing!</p>
            </div>
            <div className="mt-auto flex h-14 w-full flex-row items-center justify-between border border-border-t3 p-4 text-[#BCEBFF99]">
              <Link href="https://t.me/paystreamfi" target="_blank">
                <Image
                  src="/social/telegram.svg"
                  alt="Telegram"
                  width={24}
                  height={24}
                  className="cursor-pointer"
                />
              </Link>
              <p>Chat with us!</p>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 h-[200px] w-full select-none sm:h-[250px] md:h-[326px]">
          <Image src="/footer/paystream.svg" alt="Paystream" fill />
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Footer;
