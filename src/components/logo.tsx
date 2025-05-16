import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/">
      <Image
        className="h-32 w-32 select-none rounded-full"
        src="/logo.svg"
        width={620}
        height={620}
        alt="logo"
        priority
      />
    </Link>
  );
};

export default Logo;
