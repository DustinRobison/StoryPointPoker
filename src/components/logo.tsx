import React from "react";
import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/icon/64.png"
      alt="StoryPointers Logo"
      width={64}
      height={64}
      className="rounded-full"
    />
  );
}
