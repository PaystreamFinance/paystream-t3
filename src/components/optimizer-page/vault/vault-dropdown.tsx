"use client";
import * as React from "react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { useVaultStateStore } from "@/store/vault-state-store";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
        <DropdownMenuItem onClick={() => setVaultState("supply")}>
          Supply
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setVaultState("borrow")}>
          Borrow
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setVaultState("withdraw")}>
          Withdraw
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
