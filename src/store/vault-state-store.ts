import { create } from "zustand";

interface VaultStateStore {
  vaultState: "supply" | "borrow" | "withdraw";
  setVaultState: (vaultState: "supply" | "borrow" | "withdraw") => void;
}

export const useVaultStateStore = create<VaultStateStore>((set) => ({
  vaultState: "supply",
  setVaultState: (vaultState) => set({ vaultState }),
}));
