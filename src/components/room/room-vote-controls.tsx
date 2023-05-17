import React, { ChangeEventHandler } from "react";

interface RoomVoteControlsProps {
  showVotes: boolean;
  isOwner: boolean;
  leaderOnly: boolean;
  handleOwnerLockChange: ChangeEventHandler<HTMLInputElement>;
  handleShowVotes: (arg0: boolean) => {};
  handleClearVotes: () => {};
}

export default function RoomVoteControls({
  showVotes,
  isOwner,
  leaderOnly,
  handleOwnerLockChange,
  handleShowVotes,
  handleClearVotes,
}: RoomVoteControlsProps) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-1 py-2">
        <button
          className={`${
            leaderOnly && !isOwner
              ? "bg-slate-500"
              : "bg-blue hover:opacity-90 drop-shadow-md"
          } text-white font-semibold rounded  py-2`}
          onClick={() => handleClearVotes()}
        >
          Clear Votes
        </button>
        <button
          className={`${
            leaderOnly && !isOwner
              ? "bg-slate-500"
              : "bg-blue hover:opacity-90 drop-shadow-md"
          } text-white font-semibold rounded  py-2`}
          onClick={() => handleShowVotes(!showVotes)}
        >
          {showVotes ? "Hide Votes" : "Show Votes"}
        </button>
      </div>
      <div>
        <input
          type="checkbox"
          className="mr-2"
          disabled={!isOwner}
          checked={leaderOnly}
          onChange={handleOwnerLockChange}
        />
        <span>Lock controls to room creator</span>
      </div>
    </div>
  );
}
