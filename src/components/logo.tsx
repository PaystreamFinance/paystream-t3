import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <Image
      className="select-none rounded-full"
      src="/logo.png"
      width={32}
      height={32}
      alt="logo"
    />
  );
};

export default Logo;
