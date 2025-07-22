"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

import Logo from "./logo";
import MaxWidthWrapper from "./max-width-wrapper";

const navItems = [
  {
    label: "What",
    href: "/#features",
  },
  {
    label: "How to earn?",
    href: "https://x.com/Paystream_/status/1901629122105008408",
    target: "_blank",
  },
  {
    label: "Docs",
    href: "https://docs.paystream.finance",
    target: "_blank",
  },
  {
    label: "Whitepaper",
    href: "/whitepaper.pdf",
    target: "_blank",
  },
];

const mobileMenuItems = [
  {
    label: "Features",
    href: "/features",
  },
  {
    label: "Optimisers",
    href: "/optimizers",
  },
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="border-b border-border-t3">
      <MaxWidthWrapper className="flex w-[min(60rem,_100%-0rem)] items-center justify-between border-x border-border-t3 px-6 py-5 sm:w-[min(60rem,_100%-2rem)]">
        <Link href="/" className="z-50">
          <Logo />
        </Link>

        {/* Mobile Menu Button */}
        {isMobile && (
          <motion.button
            onClick={toggleMenu}
            className="z-50 flex items-center justify-center"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <AnimatePresence initial={false} mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6 text-[#EAEAEA]" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-6 w-6 text-[#325889]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        )}

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item?.target ?? "_self"}
                className="hover:text-accent-t3 text-sm font-normal text-[#325889] transition-all hover:brightness-150"
              >
                {item.label}
              </Link>
            ))}

            <Link href="https://forms.gle/C9zx9j5Gwz8uCadq9" target="_blank">
              <Button variant="primary">Join Waitlist</Button>
            </Link>
          </div>
        )}

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-none fixed inset-0 z-40"
            >
              <div
                className="absolute inset-0 bg-transparent"
                onClick={() => setIsMenuOpen(false)}
                style={{ pointerEvents: "auto" }}
              />
              <motion.div
                initial={{ y: "-100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ type: "easeInOut", duration: 0.3 }}
                className="pointer-events-auto absolute left-0 right-0 top-0 flex flex-col bg-black/10 p-6 pb-10 pt-20 backdrop-blur-md"
              >
                <div className="flex flex-col items-start space-y-6">
                  {/* Mobile menu items */}
                  {navItems.map((item) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="w-full"
                    >
                      <Link
                        href={item.href}
                        className="text-2xl font-light text-[#EAEAEA] transition-all hover:text-[#BCEBFF]"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </MaxWidthWrapper>
    </div>
  );
};

export default Navbar;
