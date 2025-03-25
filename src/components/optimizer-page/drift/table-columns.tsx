"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type OptimizerTable = {
  id: string;
  asset: "usdc" | "sol";

  balance: number;
  avl_liquidity: number;
  borrow_apr: number;
  supply_apr: number;
  p2p_apr: number;
};

export const columns: ColumnDef<OptimizerTable>[] = [
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
        <Link 
          href={`/optimizers/drift/${row.original.asset}`}
          className="flex items-center gap-2 hover:opacity-80"
        >
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
    accessorKey: "balance",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Balance
      </HeaderButton>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col items-start justify-start font-inter">
          <p className="text-[14px] text-[#FAFAFA]">${row.original.balance}M</p>
          <p className="text-[12px] text-[#9CE0FF66]">
            {row.original.balance} {row.original.asset}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "avl_liquidity",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Available Liquidity
      </HeaderButton>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col items-start justify-start font-inter">
          <p className="text-[14px] text-[#FAFAFA]">
            ${row.original.avl_liquidity}M
          </p>
          <p className="text-[12px] text-[#9CE0FF66]">
            {row.original.avl_liquidity} {row.original.asset}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "borrow_apr",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Borrow APR
      </HeaderButton>
    ),
    cell: ({ row }) => {
      return (
        <p className="text-[14px] font-light text-[#9CE0FF]">
          {row.original.borrow_apr}%
        </p>
      );
    },
  },
  {
    accessorKey: "supply_apr",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Supply APR
      </HeaderButton>
    ),
    cell: ({ row }) => {
      return (
        <p className="text-[14px] font-light text-[#9CE0FF]">
          {row.original.supply_apr}%
        </p>
      );
    },
  },
  {
    accessorKey: "p2p_apr",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        P2P APR
      </HeaderButton>
    ),
    cell: ({ row }) => {
      return (
        <p className="text-[14px] font-light text-[#9CE0FF]">
          {row.original.p2p_apr}%
        </p>
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
      className="font-body inline-flex items-center gap-1 text-[12px] font-light uppercase text-[#9CE0FF33]"
      onClick={onClick}
    >
      {children}
      <ChevronsUpDown className="ml-2 h-4 w-4" />
    </button>
  );
};
