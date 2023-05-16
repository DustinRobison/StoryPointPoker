"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/helpers/debounce";
import { simpleStringOnly } from "@/helpers/string-helpers";
import { FirebaseContext } from "@/context/FirebaseContext";

export default function JoinRoom() {
  const router = useRouter();
  const { user, firestore, getRoomSnapshotRequest } =
    useContext(FirebaseContext);
  const [input, setInput] = useState("");
  const [state, setState] = useState({
    loading: false,
    error: "",
    exists: false,
  });
  const { loading, error, exists } = state;
  const debouncedRoomName = useDebounce(input, 300);

  useEffect(() => {
    if (debouncedRoomName && debouncedRoomName.length > 3) {
      setState({
        ...state,
        loading: true,
        error: "",
      });
      getRoomSnapshotRequest(debouncedRoomName, firestore)
        .then((roomDoc) =>
          setState({
            ...state,
            exists: roomDoc.exists(),
            loading: false,
            error: "",
          })
        )
        .catch((error) =>
          setState({
            ...state,
            loading: false,
            error: error.message,
          })
        );
    }
    // eslint-disable-next-line
  }, [debouncedRoomName]);

  const joinRoom = async () => {
    router.push(`/room/${debouncedRoomName}`);
  };

  const createRoom = async () => {
    try {
      setState({
        ...state,
        loading: true,
      });
      // @ts-ignore
      await createRoomRequest(debouncedRoomName, user);
      router.push(`/room/${debouncedRoomName}`);
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        error: `Unable to create room!`,
      });
    }
  };

  const isAwaitingValidInput =
    input !== debouncedRoomName ||
    debouncedRoomName.length < 4 ||
    loading ||
    Boolean(error);
  return (
    <div className="min-w-full md:min-w-[50%] rounded overflow-hidden shadow-lg bg-white text-black">
      <h3 className="text-xl py-6 text-center font-semibold">
        Create or join a room:
      </h3>
      <div className="flex flex-col items-center p-4">
        <div className="min-w-full py-4">
          <label className="pl-2 text-sm">Room Name:</label>
          <input
            value={input}
            onChange={(e) => setInput(simpleStringOnly(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isAwaitingValidInput && user !== null) {
                createRoom();
              }
            }}
            type="text"
            id="room_name"
            className="min-w-full bg-gray-50 border border-b-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Room name"
            required
            autoFocus
          />
          <p className="text-xs md:text-sm text-gray-500 text-left pl-2">
            Some character restrictions apply
          </p>
          <div className="h-6">
            <p className="text-xs md:text-sm text-red-800 text-left pl-2 ">
              {state.error}
            </p>
          </div>
        </div>
        <button
          type="submit"
          disabled={isAwaitingValidInput && user !== null}
          className={`min-w-full ${
            isAwaitingValidInput
              ? "bg-slate-500"
              : "bg-blue hover:opacity-90 drop-shadow-md"
          } text-white rounded-full  md:text-lg p-2`}
          onClick={state.exists ? joinRoom : createRoom}
        >
          {state.loading
            ? " Loading . . ."
            : user !== null && state.exists
            ? "Join Existing Room"
            : user !== null && !state.exists
            ? "Create Room"
            : "Create or Join Room"}
        </button>
      </div>
    </div>
  );
}
