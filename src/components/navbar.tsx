"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

import Logo from "./logo";
import MaxWidthWrapper from "./max-width-wrapper";
import toast from "react-hot-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import { PrivacyDialog } from "./optimizer-page/privacy-dialog";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton,
    ),
  { ssr: false },
);

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
    href: "https://docs.paystream.finance",
  },
];

const mobileMenuItems = [
  {
    label: "Features",
    href: "/features",
  },
  {
    label: "Optimisers",
    href: "/optimisers",
  },
];

const Navbar: React.FC = () => {
  const { publicKey } = useWallet();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const isOptimizerPage = pathname?.startsWith("/optimizer");
  const [togglePrivacy, setTogglePrivacy] = React.useState<boolean>(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  React.useEffect(() => {
    if (publicKey !== null) {
      const showPrivacy = localStorage.getItem("showPrivacy");
      if (!showPrivacy) {
        setTogglePrivacy(true);
        localStorage.setItem("showPrivacy", "true");
      } else {
        setTogglePrivacy(false);
      }
    }
  }, [publicKey]);

  return (
    <div className="border-b border-border-t3">
      <MaxWidthWrapper className="flex items-center justify-between border-x border-border-t3 px-6 py-5">
        <Logo />
        <PrivacyDialog open={togglePrivacy} onOpenChange={setTogglePrivacy} />

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
                className="hover:text-accent-t3 text-sm font-normal text-[#325889] transition-all hover:brightness-150"
              >
                {item.label}
              </Link>
            ))}

            {isOptimizerPage ? (
              <WalletMultiButton
                style={{
                  backgroundColor: "#02142B",
                  color: "#BCEBFF",
                  border: "1px solid #9CE0FF",
                  borderRadius: "8px",
                  padding: "0 24px",
                  fontSize: "12px",
                  height: "34px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  whiteSpace: "nowrap",
                  transition: "colors",
                  fontWeight: "normal",
                  cursor: "pointer",
                }}
              />
            ) : (
              <Button variant="primary">Join Waitlist</Button>
            )}
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
                  {mobileMenuItems.map((item) => (
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
