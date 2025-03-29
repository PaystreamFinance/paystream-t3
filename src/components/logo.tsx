import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/">
      <Image
        className="select-none rounded-full"
        src="/logo.svg"
        width={32}
        height={32}
        alt="logo"
      />
    </Link>
  );
};

export default Logo;
