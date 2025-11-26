import React from "react";
import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex flex-row text-2xl font-bold">
      <Image
        src="/logo-icon.png"
        alt="Logo"
        width={32}
        height={32}
        className="mr-2 rounded-full"
      />
      human<p className="italic font-normal">Age</p>
    </div>
  );
}
