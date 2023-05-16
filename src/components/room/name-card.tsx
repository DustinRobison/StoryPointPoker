import React, { useContext, useState } from "react";
import Card from "@/components/card";
import { simpleStringOnly } from "@/helpers/string-helpers";
import { useDebounce } from "@/helpers/debounce";
import { FirebaseContext } from "@/context/FirebaseContext";

interface NameCardProps {
  addUser: Function;
}

export default function NameCard({ addUser }: NameCardProps) {
  const [inputName, setInputName] = useState("");
  const [state, setState] = useState({
    loading: false,
    error: "",
    exists: false,
  });

  const { loading, error, exists } = state;
  const debouncedRoomName = useDebounce(inputName, 100);
  const { user, updateAuthProfileName } = useContext(FirebaseContext);

  const isAwaitingValidInput =
    inputName !== debouncedRoomName ||
    debouncedRoomName.length < 2 ||
    loading ||
    Boolean(error);

  const handleSubmit = async () => {
    if (!inputName) {
      setState({
        ...state,
        error: "You must enter a name",
      });
      return;
    }
    setState({
      ...state,
      loading: true,
    });
    await updateAuthProfileName(inputName);
    addUser();
  };

  return (
    <Card title="Please enter your name:">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {/* Name Text Input */}
        <div className="min-w-full py-4">
          <label className="pl-2 text-sm">Your name:</label>
          <input
            value={inputName}
            onChange={(e) => setInputName(simpleStringOnly(e.target.value))}
            type="text"
            id="input_name"
            className="min-w-full bg-gray-50 border border-b-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Your name"
            required
          />
          <p className="text-xs md:text-sm text-gray-500 text-left pl-2">
            Some character restrictions apply
          </p>
          <div className="h-6">
            <p className="text-xs md:text-sm text-red-800 text-left pl-2 "></p>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isAwaitingValidInput && user !== null}
          className={`min-w-full ${
            isAwaitingValidInput
              ? "bg-slate-500"
              : "bg-blue hover:opacity-90 drop-shadow-md"
          } text-white rounded-full  md:text-lg p-2`}
          onClick={handleSubmit}
        >
          {state.loading ? " Loading . . ." : "Submit"}
        </button>
      </form>
    </Card>
  );
}
