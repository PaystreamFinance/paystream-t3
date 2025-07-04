"use client";

import { Button } from "@/components/ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type OptimizerTable = {
  id: string;
  asset: "usdc" | "sol";
  deposit_volume: string;
  supply_volume_usd: string;
  supply_volume: number;
  noOfToken: number;
  avl_liquidity: number;
  avl_liquidity_usd: number;
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
    accessorKey: "supply_volume",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Supply
      </HeaderButton>
    ),
    cell: ({ row }) => {
      return (
        <Link
          href={`/optimizers/drift/${row.original.asset}`}
          className="flex items-center gap-2 hover:opacity-80"
        >
          <div className="flex flex-col items-start justify-start font-inter">
            <p className="text-[14px] text-[#FAFAFA]">
              ${row.original.supply_volume_usd}
            </p>
            <p className="text-[12px] text-[#9CE0FF66]">
              {row.original.supply_volume} {row.original.asset}
            </p>
          </div>
        </Link>
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
        <Link
          href={`/optimizers/drift/${row.original.asset}`}
          className="flex items-center gap-2 hover:opacity-80"
        >
          <div className="flex flex-col items-start justify-start font-inter">
            <p className="text-[14px] text-[#FAFAFA]">
              ${row.original.avl_liquidity_usd}
            </p>
            <p className="text-[12px] text-[#9CE0FF66]">
              {row.original.avl_liquidity} {row.original.asset}
            </p>
          </div>
        </Link>
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
        <Link
          href={`/optimizers/drift/${row.original.asset}`}
          className="flex items-center gap-2 hover:opacity-80"
        >
          <p className="text-[14px] font-light text-[#9CE0FF]">
            {row.original.borrow_apr}%
          </p>
        </Link>
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
        <Link
          href={`/optimizers/drift/${row.original.asset}`}
          className="flex items-center gap-2 hover:opacity-80"
        >
          <p className="text-[14px] font-light text-[#9CE0FF]">
            {row.original.supply_apr}%
          </p>
        </Link>
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
        <Link
          href={`/optimizers/drift/${row.original.asset}`}
          className="flex items-center gap-2 hover:opacity-80"
        >
          <p className="text-[14px] font-light text-[#9CE0FF]">
            {row.original.p2p_apr}%
          </p>
        </Link>
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
