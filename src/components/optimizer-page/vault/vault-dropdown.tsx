"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useVaultStateStore } from "@/store/vault-state-store";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import * as React from "react";

export default function VaultDropdown() {
  const { vaultState, setVaultState } = useVaultStateStore();
  const [open, setOpen] = React.useState(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="w-fit bg-[#9CE0FF0F] font-body text-[#9CE0FF] hover:bg-[#9CE0FF0F]">
          {vaultState.charAt(0).toUpperCase() + vaultState.slice(1)}
          {open ? (
            <ChevronLeft className="ml-1 h-4 w-4" />
          ) : (
            <ChevronRight className="ml-1 h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        align="start"
        className="w-fit border-none bg-[#9CE0FF0F] font-body text-[#9CE0FF] backdrop-blur-lg"
      >
        <DropdownMenuItem onClick={() => setVaultState("lend")}>
          Lend
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setVaultState("borrow")}>
          Borrow
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={() => setVaultState("withdraw")}>
          Withdraw
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function VaultDropdownMonth() {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState("1 month");
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="w-fit bg-[#9CE0FF14] font-body text-white hover:bg-[#9CE0FF14]">
          {month}
          {open ? (
            <ChevronUp className="ml-1 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-1 h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit border-none bg-[#9CE0FF0F] font-body text-[#9CE0FF] backdrop-blur-lg">
        <DropdownMenuItem onClick={() => setMonth("1 month")}>
          1 month
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setMonth("3 months")}>
          3 months
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setMonth("6 months")}>
          6 months
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setMonth("9 months")}>
          9 months
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
