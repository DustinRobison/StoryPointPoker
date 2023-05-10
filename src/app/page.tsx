import ForkMe from "@/components/fork";
import JoinRoom from "@/components/join-room";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-between md:p-12 bg-slate-50">
      <JoinRoom />
      <ForkMe />
    </main>
  );
}
