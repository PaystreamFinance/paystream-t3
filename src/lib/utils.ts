import { AnchorProvider, type Wallet } from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createProvider = () => {
  const connection = new Connection(process.env.RPC_URL!);
  return new AnchorProvider(connection, {} as Wallet, {
    commitment: "processed",
  });
};

export const POSITION_TYPE_MAP = {
  lending: "LEND",
  p2pLending: "P2P LEND",
  borrows: "BORROW",
} as const;

// Simple logger with levels
export const logger = {
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },
  info: (message: string, ...args: any[]) => {
    console.info(`[INFO] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
};
