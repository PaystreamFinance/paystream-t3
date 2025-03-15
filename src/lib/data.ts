import { OptimizerTable } from "@/components/optimizer-page/drift/table-columns";

export async function getStats() {
  return [
    { title: "Supply Volume", value: "$102.3k" },
    { title: "Borrow Volume", value: "$12.3k" },
    { title: "Matched Rate", value: "78.9%" },
    { title: "Available Liquidity", value: "$902.3k" },
  ];
}

export async function getTableData(count: number): Promise<OptimizerTable[]> {
  const assets = ["weth", "dai", "usdc"] as const;
  const result: OptimizerTable[] = [];

  for (let i = 0; i < count; i++) {
    const assetIndex = i % assets.length;
    const asset = assets[assetIndex];
    const multiplier = assetIndex === 0 ? 100 : assetIndex === 1 ? 200 : 300;

    result.push({
      id: (i + 1).toString(),
      asset: asset as "weth" | "dai" | "usdc",
      balance: multiplier,
      avl_liquidity: multiplier,
      borrow_apr: 9.35,
      supply_apr: 10.35,
      p2p_apr: 10.35,
    });
  }

  return result;
}
