import * as React from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OptimizersDropdown() {
  const optimizers = [
    {
      name: "USDC",
      path: "/optimizers/drift/usdc",
    },
    {
      name: "SOL",
      path: "/optimizers/drift/sol",
    },
    // {
    //   name: "Kamino",
    //   path: "/optimizers/kamino",
    // },
    // {
    //   name: "Marginfi",
    //   path: "/optimizers/marginfi",
    // },
    // {
    //   name: "Save",
    //   path: "/optimizers/save",
    // },
  ];
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="w-fit bg-[#9CE0FF0F] font-body text-[#9CE0FF] hover:bg-[#9CE0FF0F]">
          Markets
          {open ? (
            <ChevronDown className="ml-1 h-4 w-4" />
          ) : (
            <ChevronUp className="ml-1 h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        className="w-fit border-none bg-[#9CE0FF0F] font-body text-[#9CE0FF] backdrop-blur-lg"
      >
        {optimizers.map((optimizer) => (
          <DropdownMenuItem
            key={optimizer.name}
            onClick={() => router.push(optimizer.path)}
          >
            {optimizer.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
