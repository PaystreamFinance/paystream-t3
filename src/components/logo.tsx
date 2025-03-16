import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <Image
      className="h-8 w-8 select-none rounded-full"
      src="/logo.png"
      width={320}
      height={320}
      alt="logo"
      priority
    />
  );
};

export default Logo;
