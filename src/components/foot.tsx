import React from "react";

export default function Foot() {
  return (
    <div className="h-200 flex flex-col md:flex-row justify-between px-10 py-5 bg-blue border-t-2">
      <h5>Copyright © 2023 - Dustin Robison</h5>
      <h5>
        Built with care by{" "}
        <a
          className="text-indigo underline"
          href="https://github.com/DustinRobison"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dustin Robison
        </a>
      </h5>
    </div>
  );
}
