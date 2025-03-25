import { OptimizerTable } from "@/components/optimizer-page/drift/table-columns";

export async function getStats() {
  return [
    { title: "Supply Volume", value: "$102.3k" },
    { title: "Borrow Volume", value: "$12.3k" },
    { title: "Match Rate", value: "78.9%" },
    { title: "Available Liquidity", value: "$902.3k" },
  ];
}

export async function getTableData() {
  return [
    {
      id: "1",
      asset: "sol" as const,
      balance: 200,
      avl_liquidity: 200,
      borrow_apr: 9.35,
      supply_apr: 10.35,
      p2p_apr: 10.35,
    },
    {
      id: "2",
      asset: "usdc" as const,
      balance: 100,
      avl_liquidity: 100,
      borrow_apr: 9.35,
      supply_apr: 10.35,
      p2p_apr: 10.35,
    }
  ];
}
