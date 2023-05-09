import ForkMe from "@/components/fork";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-between md:p-12 bg-slate-50">
      <div className="min-w-full md:min-w-[50%] rounded overflow-hidden shadow-lg bg-white text-black">
        <h3 className="text-xl py-6 text-center font-semibold">
          Create or join a room:
        </h3>
        <div className="flex flex-col items-center p-4">
          <div className="min-w-full py-4">
            <input
              type="text"
              id="room_name"
              className="min-w-full bg-gray-50 border border-b-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Room name"
              required
            />
            <p className="text-xs md:text-sm text-gray-500 text-left pl-2">
              Some character restrictions apply
            </p>
            <p className="text-xs md:text-sm text-red-800 text-left pl-2"></p>
          </div>
          <button
            type="submit"
            disabled
            className="min-w-full bg-blue hover:opacity-90 text-white rounded-full drop-shadow-md md:text-lg p-2"
          >
            Create Room
          </button>
        </div>
      </div>
      <ForkMe />
    </main>
  );
}
