"use client";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useVaultStateStore } from "@/store/vault-state-store";
import Image from "next/image";
import { useState } from "react";

export default function VaultActions() {
  const [inputValue, setInputValue] = useState("");
  const { vaultState, setVaultState } = useVaultStateStore();
  const [leverageValue, setLeverageValue] = useState(33);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <>
      {vaultState === "supply" && (
        <div className="flex flex-col gap-4 bg-[#9CE0FF05] p-[12px]">
          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              Supply USDC
            </span>
            <div className="ml-auto flex items-center gap-2 font-body">
              <span className="text-sm text-[#BCEBFF80]">Balance: 2000</span>
              <span className="cursor-pointer text-sm text-[#BCEBFF80]">
                50%
              </span>
              <span className="cursor-pointer text-sm text-[#BCEBFF80]">
                MAX
              </span>
            </div>
          </div>
          <div className="flex h-[73px] w-full items-center justify-between bg-[#000D1E80] px-[16px]">
            <div className="flex items-center gap-2">
              <Image
                src="/optimizers/usdc.png"
                alt="vault"
                width={100}
                height={100}
                className="h-6 w-6"
              />
              <span className="font-body text-[20px] font-[500] uppercase text-[#EAEAEA]">
                USDC
              </span>
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="h-full w-full border-none bg-transparent text-right font-darkerGrotesque text-[40px] font-[400] uppercase text-[#EAEAEAA3] shadow-none outline-none focus:border-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="0.0"
              style={{ fontSize: "40px" }}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              Supply APY
            </span>

            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF]">
              ---
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              Deposit Value
            </span>

            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF]">
              ---
            </span>
          </div>
          <Button variant="shady" className="w-full">
            Connect Wallet
          </Button>
        </div>
      )}
      {vaultState === "withdraw" && (
        <div className="flex flex-col gap-4 bg-[#9CE0FF05] p-[12px]">
          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              Withdraw USDC
            </span>
            <div className="ml-auto flex items-center gap-2 font-body">
              <span className="text-sm text-[#BCEBFF80]">Balance: 2000</span>
              <span className="cursor-pointer text-sm text-[#BCEBFF80]">
                50%
              </span>
              <span className="cursor-pointer text-sm text-[#BCEBFF80]">
                MAX
              </span>
            </div>
          </div>
          <div className="flex h-[73px] w-full items-center justify-between bg-[#000D1E80] px-[16px]">
            <div className="flex items-center gap-2">
              <Image
                src="/optimizers/usdc.png"
                alt="vault"
                width={100}
                height={100}
                className="h-6 w-6"
              />
              <span className="font-body text-[20px] font-[500] uppercase text-[#EAEAEA]">
                USDC
              </span>
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="h-full w-full border-none bg-transparent text-right font-darkerGrotesque text-[40px] font-[400] uppercase text-[#EAEAEAA3] shadow-none outline-none focus:border-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="0.0"
              style={{ fontSize: "40px" }}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              Transaction Settings
            </span>

            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF]">
              Normal
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              Supply APY
            </span>

            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF]">
              ---
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              Deposit Value
            </span>

            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF]">
              ---
            </span>
          </div>
          <Button variant="shady" className="w-full">
            Connect Wallet
          </Button>
        </div>
      )}
      {vaultState === "borrow" && (
        <div className="flex flex-col gap-4 bg-[#9CE0FF05] p-[12px]">
          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              Borrow USDC
            </span>
            <div className="ml-auto flex items-center gap-2 font-body">
              <span className="text-sm text-[#BCEBFF80]">Balance: 2000</span>
              <span className="cursor-pointer text-sm text-[#BCEBFF80]">
                50%
              </span>
              <span className="cursor-pointer text-sm text-[#BCEBFF80]">
                MAX
              </span>
            </div>
          </div>
          <div className="flex h-[73px] w-full items-center justify-between bg-[#000D1E80] px-[16px]">
            <div className="flex items-center gap-2">
              <Image
                src="/optimizers/usdc.png"
                alt="vault"
                width={100}
                height={100}
                className="h-6 w-6"
              />
              <span className="font-body text-[20px] font-[500] uppercase text-[#EAEAEA]">
                USDC
              </span>
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="h-full w-full border-none bg-transparent text-right font-darkerGrotesque text-[40px] font-[400] uppercase text-[#EAEAEAA3] shadow-none outline-none focus:border-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="0.0"
              style={{ fontSize: "40px" }}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              Supply Collateral
            </span>
            <div className="flex items-center gap-2">
              <Image
                src="/optimizers/juplp.svg"
                alt="vault"
                width={100}
                height={100}
                className="h-6 w-6"
              />
              <span className="font-body text-[20px] font-[500] uppercase text-[#EAEAEA]">
                JLP
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
                Leverage
              </span>

              <span className="font-body text-[20px] font-[500] uppercase text-[#EAEAEA]">
                {(leverageValue / 33).toFixed(1)}x
              </span>
            </div>
            <div className="relative">
              <Slider
                defaultValue={[33]}
                max={100}
                min={1}
                step={1}
                onValueChange={(value: number[]) => {
                  const newValue = value[0];
                  if (typeof newValue === "number") {
                    setLeverageValue(newValue);
                  }
                }}
                trackClassName="bg-[#9CE0FF14]"
                rangeClassName="bg-[#9CE0FFCC]"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              />
              <div
                className="absolute -top-8 rounded bg-[#000D1E] px-2 py-1 font-body text-xs text-[#9CE0FF] transition-opacity"
                style={{
                  left: `calc(${leverageValue}% - 15px)`,
                  transform: "translateX(-50%)",
                  opacity: isHovering ? 1 : 0,
                }}
              >
                {(leverageValue / 33).toFixed(1)}x
                <div className="absolute bottom-[-4px] left-1/2 h-0 w-0 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-[#000D1E]"></div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              Borrow APY
            </span>

            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF]">
              ---
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              USDC Debt
            </span>

            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF]">
              ---
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF33]">
              Loan-to-value Ratio
            </span>

            <span className="font-body text-[12px] font-[500] uppercase text-[#9CE0FF]">
              ---
            </span>
          </div>
          <Button variant="shady" className="w-full">
            Connect Wallet
          </Button>
        </div>
      )}
    </>
  );
}
