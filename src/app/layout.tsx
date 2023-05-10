import Nav from "@/components/nav";
import "./globals.css";
import { Inter } from "next/font/google";
import Foot from "@/components/foot";
import { AuthContextProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Scrum Story Points",
  description:
    "Story Point Poker, Scrum Story Points for agile scrum backlog grooming",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Nav />
        <AuthContextProvider>{children}</AuthContextProvider>
        <Foot />
      </body>
    </html>
  );
}
