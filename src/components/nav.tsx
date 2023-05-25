import React from "react";
import Logo from "./logo";
import Link from "next/link";

export default function Nav() {
  return (
    <header className="lg:space-x-5 font-bold px-10 py-5 bg-blue border-b-2 md:filter-none shadow-lg ">
      <div className="flex items-center hover:opacity-75">
        <Logo />
        <div className="pl-5 py-3 ">
          <Link href={"/"}>
            <h3 className="text-xl md:text-4xl">ScrumStoryPoints</h3>
            <p>StoryPointPoker</p>
          </Link>
        </div>
      </div>
      <ul className="flex">
        <li className="pr-4 border-r-2 flex align-center">
          <Link href="/about" className="flex align-center justify-center">
            <button className="text-white hover:opacity-50">About</button>
          </Link>
        </li>
        <li className="px-4 border-x-2 flex align-center">
          <a
            href="https://github.com/DustinRobison/StoryPointPoker/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="text-white hover:opacity-50">
              Report Issue
            </button>
          </a>
        </li>
        <li className="px-4 border-l-2 flex align-center justify-center">
          <a
            href="https://www.patreon.com/ScrumStoryPoints"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="text-white hover:opacity-50">
              Buy me coffee
            </button>
          </a>
        </li>
      </ul>
    </header>
  );
}
