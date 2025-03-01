import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <Image
      className="rounded-full"
      src="/logo.svg"
      width={32}
      height={32}
      alt="logo"
    />
  );
};

export default Logo;
