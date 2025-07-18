"use client";

import { BN } from "@coral-xyz/anchor";
import { type ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import RepaymentModal from "./repayment-modal";
import WithdrawModal from "./withdraw-modal";
import { type PositionData, type MatchData, bnToNumber } from "@/lib/contract";

export type DashboardTable = {
  id: string;
  asset: "USDC" | "SOL";
  position: string;
  type:
    | "UNMATCHED"
    | "COLLATERAL"
    | "P2P LEND"
    | "P2P BORROW"
    | "PENDING BORROW";
  apy: string;
  positionData: PositionData;
  // action_amount: number;
  amount_in_usd: number;
  matches: MatchData[];
  onSuccess: () => void;
};

export const dashboardColumn: ColumnDef<DashboardTable>[] = [
  {
    accessorKey: "asset",
    header: ({ column }) => (
      <p className="inline-flex items-center gap-1 font-body text-[12px] font-light uppercase text-[#9CE0FF33]">
        Asset
      </p>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Image
            src={`/optimizers/${row.original.asset.toLowerCase()}.png`}
            alt={row.original.asset}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="text-[14px] font-light text-[#9CE0FF]">
            {row.original.asset.toUpperCase()}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "position",
    header: ({ column }) => (
      <p className="inline-flex items-center gap-1 font-body text-[12px] font-light uppercase text-[#9CE0FF33]">
        Position
      </p>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <p className="text-[14px] font-light text-[#9CE0FF]">
          $ {Number(row.original.amount_in_usd.toFixed(4))}
        </p>
        <p className="text-[12px] font-light text-[#9CE0FF33]">
          {bnToNumber(
            row.original.positionData.amount,
            row.original.asset === "USDC" ? 6 : 9,
          )}{" "}
          {row.original.asset}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <p className="inline-flex items-center gap-1 font-body text-[12px] font-light uppercase text-[#9CE0FF33]">
        Type
      </p>
    ),
    cell: ({ row }) => (
      <p className="text-[14px] font-light text-[#9CE0FF]">
        {row.original.type.charAt(0).toUpperCase() + row.original.type.slice(1)}
      </p>
    ),
  },
  {
    accessorKey: "apy",
    header: ({ column }) => (
      <p className="inline-flex items-center gap-1 font-body text-[12px] font-light uppercase text-[#9CE0FF33]">
        APY
      </p>
    ),
    cell: ({ row }) => (
      <p className="text-[14px] font-light text-[#9CE0FF]">
        {row.original.apy}%
      </p>
    ),
  },
  {
    accessorKey: "action",
    header: ({ column }) => (
      <p className="inline-flex items-center gap-1 font-body text-[12px] font-light uppercase text-[#9CE0FF33]">
        Action
      </p>
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      const buttonText = type === "P2P BORROW" ? "Repayment" : "Withdraw";

      return (
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="text-[14px] text-[#9CE0FF]" variant="primary">
                {buttonText}
              </Button>
            </DialogTrigger>
            <DialogContent className="border border-[#9CE0FF] bg-[#070f14] sm:max-w-[550px]">
              {type === "P2P BORROW" ? (
                <RepaymentModal row={row} onSuccess={row.original.onSuccess} />
              ) : (
                (type === "COLLATERAL" || type === "UNMATCHED") && (
                  <WithdrawModal row={row} onSuccess={row.original.onSuccess} />
                )
              )}
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];

const HeaderButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      className="inline-flex items-center gap-1 font-body text-[12px] font-light uppercase text-[#9CE0FF33]"
      onClick={onClick}
    >
      {children}
      <ChevronsUpDown className="ml-2 h-4 w-4" />
    </button>
  );
};
