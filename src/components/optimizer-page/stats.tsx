export default function Stats() {
  const stats = [
    { title: "Total Supply", value: "$102.3k" },
    { title: "Total Borrow", value: "$102.3k" },
    { title: "Matched Volume", value: "$102.3k" },
    { title: "Available Liquidity", value: "$102.3k" },
  ];

  return (
    <div className="grid h-24 w-full grid-cols-4 divide-x divide-solid divide-border-t3">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex flex-col items-start justify-center border-y border-border-t3 px-7 py-6"
        >
          <span className="font-darkerGrotesque text-lg text-[#BCEBFF80]">
            {stat.title}
          </span>
          <span className="font-darkerGrotesque text-3xl font-thin text-white">
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}
