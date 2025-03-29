import { type DashboardTable } from "@/app/dashboard/_components/dashboard-column";

export async function getStats() {
  return [
    { title: "Supply Volume", value: "Not available in testnet" },
    { title: "Borrow Volume", value: "Not available in testnet" },
    { title: "Match Rate", value: "Not available in testnet" },
    { title: "Available Liquidity", value: "Not available in testnet" },
  ];
}

export async function getTableData() {
  return [
    {
      id: "1",
      asset: "sol" as const,
      balance: 200,
      avl_liquidity: 200,
      borrow_apr: 3.8,
      supply_apr: 9.1,
      p2p_apr: 8.4,
    },
    {
      id: "2",
      asset: "usdc" as const,
      balance: 100,
      avl_liquidity: 100,
      borrow_apr: 4.6,
      supply_apr: 10.01,
      p2p_apr: 7.36,
    },
  ];
}

export async function getDashboardTableData() {
  return [
    {
      id: "1",
      asset: "sol" as const,
      position: "100",
      type: "borrow",
      apy: "8.4",
    },
    {
      id: "2",
      asset: "usdc" as const,
      position: "200",
      type: "lend",
      apy: "7.36",
    },
  ] as DashboardTable[];
}
