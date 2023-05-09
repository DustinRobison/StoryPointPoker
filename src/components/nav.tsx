import React from "react";
import Logo from "./logo";
import Link from "next/link";

export default function Nav() {
  return (
    <header className="flex lg:space-x-5 justify-between font-bold px-10 py-5 bg-blue border-b-2 md:filter-none shadow-lg ">
      <div className="flex items-center">
        <Logo />
        <div className="pl-5 py-3 ">
          <Link href={"/"}>
            <h3 className="text-xl md:text-4xl">ScrumStoryPoints</h3>
            <p>StoryPointPoker</p>
          </Link>
        </div>
      </div>

      <div className="hidden">right nav</div>
    </header>
  );
}
