import { create } from "zustand";

interface VaultStateStore {
  vaultState: "lend" | "borrow" | "withdraw";
  setVaultState: (vaultState: "lend" | "borrow" | "withdraw") => void;
}

export const useVaultStateStore = create<VaultStateStore>((set) => ({
  vaultState: "lend",
  setVaultState: (vaultState) => set({ vaultState }),
}));
