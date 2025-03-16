import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";

const items = [
  {
    id: "1",
    title: "For a position, what fees am I paying?",
    content:
      "User will pay fees only when their position is matched with a borrower through our engine, the fees will be a certain percentage of the APY spread(generally 10%)",
  },
  {
    id: "2",
    title: "Why should I use Paystream over Kamino?",
    content:
      "On Kamino, APYs are influenced by DEX trading fees and incentives and the yields fluctuate based on multiple factors. Paystream provides a way of getting better rates while having the same guarantee, the same liquidity that you already get on other platforms.",
  },

  {
    id: "3",
    title: "Are there any subscriptions?",
    content: "No",
  },

  {
    id: "4",
    title: "What will happen if the position is not matched?",
    content:
      "User will keep earning underlying market yield returns and reward points of paystream",
  },
];

const Faq: React.FC = () => {
  return (
    <div className="my-44 flex flex-col items-center justify-center">
      <h2 className="font-darkGrotesque text-center text-[64px] font-normal leading-[65.28px] tracking-[-1%] text-[#EAEAEA]">
        Frequently Asked <br />
        <span className="font-ibmPlexSerif font-normal italic">Questions</span>
      </h2>

      <p className="mt-6 text-center text-lg font-normal leading-[19.8px] text-[#BCEBFF99]">
        No matter what your requirements are, <br />
        Paystream fulfills each of them
      </p>

      <Accordion
        type="single"
        collapsible
        className="mt-16 w-full max-w-[588px] space-y-4"
        defaultValue="3"
      >
        {items.map((item) => (
          <AccordionItem
            value={item.id}
            key={item.id}
            className="border border-[#FFFFFF14] py-2 [&[data-state=open]]:bg-[#9CE0FF0F]"
          >
            <AccordionPrimitive.Header className="flex bg-[#000D1E]">
              <AccordionPrimitive.Trigger className="flex flex-1 items-center justify-between px-4 pb-1 pt-2 text-left text-[15px] font-semibold leading-6 text-white transition-all data-[state=open]:bg-[#9CE0FF0F] data-[state=open]:text-[#9CE0FF] [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0 [&[data-state=open]>svg]:rotate-180">
                {item.title}
                <Plus
                  size={16}
                  strokeWidth={2}
                  className="shrink-0 text-white transition-transform duration-200"
                  aria-hidden="true"
                />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent className="w-full max-w-[90%] px-4 pb-2 text-sm font-medium leading-[15.4px] tracking-[-0.1px] text-[#FFFFFFB0]">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Faq;
