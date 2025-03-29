"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
  type: "borrow" | "lend";
  apy: string;
};

export const dashboardColumn: ColumnDef<DashboardTable>[] = [
  {
    accessorKey: "asset",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Assets
      </HeaderButton>
    ),
    cell: ({ row }) => {
      return (
        <Link href={`#`} className="flex items-center gap-2 hover:opacity-80">
          <Image
            src={`/optimizers/${row.original.asset}.png`}
            alt={row.original.asset}
            width={24}
            height={24}
            className="rounded-full"
          />
          <p className="uppercase text-white">{row.original.asset}</p>
        </Link>
      );
    },
  },
  {
    accessorKey: "position",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Position
      </HeaderButton>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col items-start justify-start font-inter">
          <p className="text-[14px] text-[#FAFAFA]">{row.original.position}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Type of Order
      </HeaderButton>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col items-start justify-start font-inter">
          <p className="text-[14px] text-[#FAFAFA]">{row.original.type}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "apy",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        APY
      </HeaderButton>
    ),
    cell: ({ row }) => {
      return (
        <p className="text-[14px] font-light text-[#9CE0FF]">
          {row.original.apy}%
        </p>
      );
    },
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

      return (
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="text-[14px] text-[#9CE0FF]" variant="primary">
                {type === "borrow" ? "Repayment" : "Withdraw"}
              </Button>
            </DialogTrigger>
            <DialogContent className="border border-[#9CE0FF] bg-[#070f14] sm:max-w-[550px]">
              {type === "borrow" ? (
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
