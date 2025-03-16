import React from "react";

import { cn } from "@/lib/utils";

interface MaxWidthWrapperProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const MaxWidthWrapper: React.FC<MaxWidthWrapperProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn(
        "mx-auto w-[min(60rem,_100%-2rem)] overflow-x-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
