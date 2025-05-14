import React from "react";

const Flexible: React.FC = () => {
  return (
    <div className="relative flex w-full flex-col items-center justify-center">
      <h1 className="w-full pb-32 text-center font-ibmPlexSerif text-4xl font-normal tracking-[-1%] text-[#BCEBFF]">
        PayStream makes payments{" "}
        <span className="text-[36px] font-medium italic leading-[30.8px]">
          flexible
        </span>{" "}
        and{" "}
        <span className="text-[36px] font-medium italic leading-[30.8px]">
          effortless
        </span>
      </h1>

      <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-border-t3 to-bg-t3" />
      <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-border-t3 to-bg-t3" />

      <div className="relative h-[832px] w-full space-y-[41px] bg-[url('/flexible/lines.svg')] px-16">
        <div className="relative -mt-4 flex w-full flex-col items-start gap-5">
          <div className="absolute -right-8 top-4 h-px w-4/5 bg-gradient-to-r from-[#9CE0FF33] to-transparent" />

          <h3 className="font-ibmPlexSerif text-2xl font-medium italic text-[#BCEBFF]">
            Linear Payments
          </h3>

          <p className="w-full max-w-[250px] text-lg leading-[19.8px] text-[#BCEBFF99]">
            The simplest way to spread payments over time. Perfect for salaries,
            subscriptions, or regular loan repayments. Set it once and let it
            flow.
          </p>
        </div>

        <div className="relative flex w-full flex-col items-end gap-5">
          <div className="absolute left-12 top-4 h-px w-4/5 bg-gradient-to-r from-transparent to-[#9CE0FF33]" />

          <h3 className="font-ibmPlexSerif text-2xl font-medium italic text-[#BCEBFF]">
            Step-wise
          </h3>

          <p className="w-full max-w-[285px] text-end text-lg leading-[19.8px] text-[#BCEBFF99]">
            Release funds at specific milestones. Ideal for project-based work,
            staged investments, or performance-linked payments. Only pay when
            work is delivered.
          </p>
        </div>

        <div className="relative -mt-4 flex w-full flex-col items-start gap-5">
          <div className="absolute left-16 top-4 h-px w-4/5 bg-gradient-to-r from-[#9CE0FF33] to-transparent" />

          <h3 className="font-ibmPlexSerif text-2xl font-medium italic text-[#BCEBFF]">
            Cliff
          </h3>

          <p className="w-full max-w-[250px] text-lg leading-[19.8px] text-[#BCEBFF99]">
            Time-locked payments that release after a set period. Great for
            token vesting, delayed bonuses, or ensuring long-term commitment.
            Security meets flexibility.
          </p>
        </div>

        <div className="relative !mt-[38px] flex w-full flex-col items-end gap-5">
          <div className="absolute left-16 top-4 h-px w-4/5 bg-gradient-to-r from-transparent to-[#9CE0FF33]" />

          <h3 className="font-ibmPlexSerif text-2xl font-medium italic text-[#BCEBFF]">
            Custom
          </h3>

          <p className="w-full max-w-[335px] text-end text-lg leading-[19.8px] text-[#BCEBFF99]">
            Design your own payment curve for unique scenarios. Whether
            it&apos;s complex vesting schedules or dynamic repayment plans, you
            have full control. [0.5% fee applies for custom curves]
          </p>
        </div>
      </div>
    </div>
  );
};

export default Flexible;
