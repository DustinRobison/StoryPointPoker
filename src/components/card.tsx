import React from "react";

interface CardProps {
  title: JSX.Element;
  children: React.ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <div className="min-w-full md:min-w-[50%] rounded overflow-hidden shadow-lg bg-white text-black p-4">
      <h3 className="text-xl py-6 text-center font-semibold">{title}</h3>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}
