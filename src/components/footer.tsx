import React from "react";

import Image from "next/image";
import Link from "next/link";
import { Icons } from "./Icons";
import Logo from "./logo";
import MaxWidthWrapper from "./max-width-wrapper";

const Footer: React.FC = () => {
  return (
    <div className="relative h-[680px] w-full">
      <div className="pointer-events-none absolute bottom-0 -z-10 h-[600px] w-full select-none">
        <Image
          src="/footer/lines.svg"
          alt="Lines"
          fill
          className="object-cover"
        />
      </div>
      <MaxWidthWrapper className="flex flex-col items-center">
        <div className="mt-32 grid h-72 w-full grid-cols-3 divide-x divide-border-t3 border border-border-t3 bg-bg-t3">
          <div className="flex flex-col items-start justify-between p-6 px-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9FB2C2]">
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
            <div className="flex w-full flex-row items-start justify-start gap-5 text-sm text-[#BCEBFF99]">
              <Link href="#">Support</Link>
              <Link href="#">Terms of service</Link>
              <Link href="#">Legal Notice</Link>
            </div>
          </div>
          <div className="flex flex-col items-start justify-between p-6">
            <div className="flex w-full flex-col items-start justify-between text-[#BCEBFF99]">
              <Link href="#">What</Link>
              <Link href="#">How</Link>
              <Link href="#">Benefits</Link>
              <Link href="#">Docs</Link>
            </div>
            <div className="flex w-full flex-row items-center justify-start gap-6 text-[#BCEBFF99]">
              <Image
                src="/social/x-com.svg"
                alt="Twitter"
                width={24}
                height={24}
                className="cursor-pointer"
              />

              <Image
                src="/social/discord.svg"
                alt="Discord"
                width={24}
                height={24}
                className="cursor-pointer"
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-between p-6">
            <div className="flex w-full flex-row items-start justify-start gap-7 text-[#BCEBFF99]">
              <p>Smarter Lending, Easier Borrowing</p>
            </div>
            <div className="flex h-14 w-full flex-row items-center justify-between gap-7 border border-border-t3 p-4 text-[#BCEBFF99]">
              <Image
                src="/social/telegram.svg"
                alt="Telegram"
                width={24}
                height={24}
                className="cursor-pointer"
              />
              <p>Chat with us</p>
            </div>
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
