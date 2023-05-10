"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { firestore } from "@/firebase";
import { serverTimestamp, setDoc, doc } from "firebase/firestore";
import { useDebounce } from "@/helpers/debounce";
import { simpleStringOnly } from "@/helpers/string-helpers";
import { checkIfRoomExists } from "@/firebase/db-room";
import { AuthContext } from "@/context/AuthContext";

export default function JoinRoom() {
  //   const router = useRouter();
  const { user } = useContext(AuthContext);
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
      checkIfRoomExists(debouncedRoomName)
        .then((roomExists) =>
          setState({
            ...state,
            exists: roomExists,
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
    // router.push(`/room/${debouncedRoomName}`);
  };

  const createRoom = async () => {
    try {
      setState({
        ...state,
        loading: true,
      });
      const docRef = await setDoc(doc(firestore, "rooms", debouncedRoomName), {
        ownerId: user?.uid,
        messages: [],
        users: {},
        showVotes: false,
        createdAt: serverTimestamp(),
        lastVoteTimestamp: serverTimestamp(),
        history: [
          {
            action: `${user?.displayName} has created room ${debouncedRoomName}`,
            timestamp: new Date().toISOString(),
          },
        ],
        leaderOnly: false,
      });
      //   router.push(`/room/${debouncedRoomName}`);
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
            type="text"
            id="room_name"
            className="min-w-full bg-gray-50 border border-b-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Room name"
            required
          />
          <p className="text-xs md:text-sm text-gray-500 text-left pl-2">
            Some character restrictions apply
          </p>
          <div className="h-6">
            <p className="text-xs md:text-sm text-red-800 text-left pl-2 "></p>
          </div>
        </div>
        <button
          type="submit"
          disabled={isAwaitingValidInput}
          className={`min-w-full ${
            isAwaitingValidInput
              ? "bg-slate-500"
              : "bg-blue hover:opacity-90 drop-shadow-md"
          } text-white rounded-full  md:text-lg p-2`}
          onClick={createRoom}
        >
          {state.loading ? " Loading . . ." : " Create or join a room"}
        </button>
      </div>
    </div>
  );
}
