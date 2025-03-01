import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";

import Logo from "./logo";
import MaxWidthWrapper from "./max-width-wrapper";

const navItems = [
  {
    label: "What",
    href: "/what",
  },
  {
    label: "How",
    href: "/how",
  },
  {
    label: "Benefits",
    href: "/benefits",
  },
  {
    label: "Docs",
    href: "/docs",
  },
];

const Navbar: React.FC = () => {
  return (
    <div className="border-b border-border-t3">
      <MaxWidthWrapper className="flex items-center justify-between border-x border-border-t3 px-6 py-5">
        <Logo />

        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-accent-t3 text-sm font-normal text-[#325889] transition-all hover:brightness-150"
            >
              {item.label}
            </Link>
          ))}

          <Button variant="primary">Join Waitlist</Button>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Navbar;
