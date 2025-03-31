"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import { BN } from "@coral-xyz/anchor";

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

export type DashboardTable = {
  id: string;
  asset: "usdc" | "sol";
  position: string;
  type: "LEND" | "P2P LEND" | "BORROW";
  apy: string;
  action_amount: BN;
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
      const asset = row.original.asset;
      return (
        <div className="flex items-center gap-2">
          <Image
            src={`/optimizers/${asset}.png`}
            alt={asset}
            width={24}
            height={24}
          />
          <span className="text-[14px] font-light text-[#9CE0FF]">
            {asset.toUpperCase()}
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
      <p className="text-[14px] font-light text-[#9CE0FF]">
        {row.original.position}
      </p>
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
      const buttonText = type === "BORROW" ? "Repayment" : "Withdraw";
      
      return (
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="text-[14px] text-[#9CE0FF]" variant="primary">
                {buttonText}
              </Button>
            </DialogTrigger>
            <DialogContent className="border border-[#9CE0FF] bg-[#070f14] sm:max-w-[550px]">
              {type === "BORROW" ? (
                <RepaymentModal row={row} />
              ) : (
                <WithdrawModal row={row} />
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
