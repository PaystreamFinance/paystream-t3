"use client";
import * as React from "react";
import OptimizersCard from "./optimizers-card";
import "./carousel.css";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

type CardVariant = "drift" | "kamino" | "save" | "marginfi";

interface CarouselCard {
  variant: CardVariant;
  commingSoon: boolean;
}

export default function Carousel() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const isManualScrollRef = React.useRef(false);
  const isMobile = useIsMobile();

  /** @dev Change the cards data to add/remove cards */
  const cardsData: CarouselCard[] = [
    { variant: "drift", commingSoon: false },
    { variant: "marginfi", commingSoon: true },
    { variant: "kamino", commingSoon: true },
    { variant: "save", commingSoon: true },
  ];

  // Track scroll position and update active index
  React.useEffect(() => {
    if (isMobile) return; // Skip for mobile

    const container = scrollContainerRef.current;
    if (!container) return;

    // Simple scroll handler
    const handleScroll = () => {
      // Skip if this is a programmatic scroll
      if (isManualScrollRef.current) return;

      if (!container) return;

      // Get current scroll position
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const scrollWidth = container.scrollWidth;

      // Special case for the last card
      if (scrollLeft + containerWidth >= scrollWidth - 20) {
        setActiveIndex(cardsData.length - 1);
        return;
      }

      // Calculate card width based on viewport size
      const cardWidth =
        container.querySelector("div[data-card]")?.clientWidth || 300;
      const cardMargin =
        // eslint-disable-next-line
        parseInt(
          window.getComputedStyle(
            container.querySelector("div[data-card]") as Element,
          ).marginRight,
        ) || 16;
      const totalCardWidth = cardWidth + cardMargin;

      // Calculate active index based on scroll position
      const index = Math.round(scrollLeft / totalCardWidth);

      // Update active index
      setActiveIndex(Math.max(0, Math.min(index, cardsData.length - 1)));
    };

    // Add scroll listener
    container.addEventListener("scroll", handleScroll);

    // Handle scroll end to reset manual scroll flag
    const handleScrollEnd = () => {
      isManualScrollRef.current = false;
      handleScroll();
    };

    container.addEventListener("scrollend", handleScrollEnd);

    // Initial check
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("scrollend", handleScrollEnd);
    };
  }, [cardsData.length, isMobile]);

  // Scroll to a specific card
  const scrollToCard = (index: number) => {
    if (isMobile) {
      setActiveIndex(index);
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) return;

    // Set manual scroll flag
    isManualScrollRef.current = true;

    // Update active index immediately
    setActiveIndex(index);

    // Special case for last card
    if (index === cardsData.length - 1) {
      // Scroll to the end
      container.scrollTo({
        left: container.scrollWidth,
        behavior: "smooth",
      });
      return;
    }

    // Calculate card width based on viewport size
    const cardWidth =
      container.querySelector("div[data-card]")?.clientWidth || 300;
    const cardMargin =
      // eslint-disable-next-line
      parseInt(
        window.getComputedStyle(
          container.querySelector("div[data-card]") as Element,
        ).marginRight,
      ) || 16;
    const totalCardWidth = cardWidth + cardMargin;

    // Calculate scroll position
    const scrollLeft = index * totalCardWidth;

    // Scroll to position
    container.scrollTo({
      left: scrollLeft,
      behavior: "smooth",
    });
  };

  // Mobile layout - stack cards vertically
  if (isMobile) {
    return (
      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex w-full flex-col gap-4">
          {cardsData.map((card, index) => (
            <div key={index} className="w-full">
              <OptimizersCard
                variant={card.variant}
                commingSoon={card.variant === "drift" ? false : true}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop layout - carousel
  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* Carousel container */}
      <div className="relative w-full overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="no-scrollbar flex w-full overflow-x-auto scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {cardsData.map((card, index) => (
            <div
              key={index}
              data-card
              className="mr-3 flex w-[260px] flex-none justify-center sm:mr-4 sm:w-[320px] md:mr-6 md:w-[400px] lg:mr-8 lg:w-[474px]"
            >
              <OptimizersCard
                variant={card.variant}
                commingSoon={card.variant === "drift" ? false : true}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 py-2">
        {cardsData.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToCard(index)}
            className={cn(
              "h-1 w-1 transition-all",
              activeIndex === index ? "bg-[#9CE0FF]" : "bg-[#9CE0FF]/20",
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
