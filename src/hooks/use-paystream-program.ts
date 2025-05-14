import { AnchorProvider } from "@coral-xyz/anchor";
import { PaystreamV1Program } from "@meimfhd/paystream-v1";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { useEffect, useState } from "react";

export function usePaystreamProgram() {
  const [paystreamProgram, setPaystreamProgram] =
    useState<PaystreamV1Program | null>(null);
  const wallet = useAnchorWallet();
  const [provider, setProvider] = useState<AnchorProvider | null>(null);

  useEffect(() => {
    if (!wallet) return;
    const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL!);
    const provider = new AnchorProvider(connection, wallet, {
      commitment: "processed",
    });
    const program = new PaystreamV1Program(provider);
    setPaystreamProgram(program);
    setProvider(provider);
  }, [wallet]);

  return { paystreamProgram, provider };
}
