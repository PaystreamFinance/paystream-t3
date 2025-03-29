"use client";

import { Plus, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cross,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useVaultStateStore } from "@/store/vault-state-store";
import { Day } from "react-day-picker";
import { VaultDropdownMonth } from "./vault-dropdown";
const chartData = [
  { month: "January", apy: 18, day: 100 },
  { month: "February", apy: 30, day: 200 },
  { month: "March", apy: 23, day: 300 },
  { month: "April", apy: 7, day: 400 },
  { month: "May", apy: 20, day: 500 },
  { month: "June", apy: 21, day: 600 },
  { month: "July", apy: 21, day: 700 },
  { month: "August", apy: 21, day: 800 },
  { month: "September", apy: 21, day: 900 },
  { month: "October", apy: 21, day: 1000 },
  { month: "November", apy: 21, day: 1100 },
  { month: "December", apy: 21, day: 1200 },
  { month: "January", apy: 21, day: 1300 },
  { month: "February", apy: 21, day: 1400 },
  { month: "March", apy: 21, day: 1500 },
  { month: "April", apy: 21, day: 1600 },
  { month: "May", apy: 21, day: 1700 },
  { month: "June", apy: 21, day: 1800 },
];

function getChartData(count = 18, startApy = 5, increment = 1.5) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return Array.from({ length: count }, (_, i) => {
    const monthIndex = i % 12;
    const apy = startApy + i * increment;

    return {
      month: months[monthIndex],
      // apy: parseFloat(apy.toFixed(1)),
      apy: 100 * i,
      day: (i + 1) * 100,
    };
  });
}

const chartConfig = {
  apy: {
    label: "Supply APY",
    color: "#9CE0FF",
  },
} satisfies ChartConfig;

export function VaultGraph({ dataUser }: { dataUser: { position: string } }) {
  const { vaultState, setVaultState } = useVaultStateStore();
  const data = getChartData();

  return (
    <Card className="w-full border-none bg-transparent">
      <CardHeader>
        <div className="grid grid-cols-2">
          <div className="flex flex-col items-start justify-center gap-1 px-8 py-6">
            <span className="font-darkerGrotesque text-[20px] font-[500] text-[#BCEBFF80]">
              Total Supply
            </span>
            <span className="font-darkerGrotesque text-[32px] font-[400] text-[#EAEAEA]">
              {dataUser.position}
            </span>
          </div>
          <div className="flex items-start justify-end gap-1 px-8 py-6">
            <Button
              variant="outline"
              className={`w-fit border-border-t3 bg-transparent font-body text-[#BCEBFF80] hover:bg-[#BCEBFF] ${
                vaultState === "supply" ? "bg-[#BCEBFF] text-[#02142B]" : ""
              }`}
              onClick={() => setVaultState("supply")}
            >
              Supply
            </Button>
            <Button
              variant="outline"
              className={`w-fit border-border-t3 bg-transparent font-body text-[#BCEBFF80] hover:bg-[#BCEBFF] ${
                vaultState === "borrow" ? "bg-[#BCEBFF] text-[#02142B]" : ""
              }`}
              onClick={() => setVaultState("borrow")}
            >
              Borrow
            </Button>
            {/* <Button
              variant="outline"
              className={`w-fit border-border-t3 bg-transparent font-body text-[#BCEBFF80] hover:bg-[#BCEBFF] ${
                vaultState === "withdraw" ? "bg-[#BCEBFF] text-[#02142B]" : ""
              }`}
              onClick={() => setVaultState("withdraw")}
            >
              Withdraw
            </Button> */}
            <VaultDropdownMonth />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} horizontal={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis dataKey="day" tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{
                stroke: "#9CE0FF01",
                strokeDasharray: "5 5",
                strokeWidth: 1,
                strokeOpacity: 0.7,
              }}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              dataKey="apy"
              type="linear"
              fill="#9CE0FF"
              fillOpacity={0.4}
              stroke="#9CE0FF"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>lol</CardFooter>
    </Card>
  );
}
