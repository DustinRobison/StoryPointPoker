"use client";

import Card from "@/components/card";
import PageLoad from "@/components/page-load";
import NameCard from "@/components/room/name-card";
import { useRoom } from "@/components/room/room-hooks";
import { FirebaseContext } from "@/context/FirebaseContext";
import { useContext, useEffect, useState } from "react";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import RoomTimer from "@/components/room/room-timer";
import RoomUsersList from "@/components/room/room-users-list";
import RoomVoteControls from "@/components/room/room-vote-controls";
import { useDebounce } from "@/helpers/debounce";

const ROOM_BUTTON_VALUES = ["0", "1", "2", "3", "5", "8", "13", "20", "?"];

export default function Page({ params }: { params: { slug: string } }) {
  const { user } = useContext(FirebaseContext);
  const {
    loading,
    error,
    exists,
    ownerId,
    users,
    sharedText,
    // messages,
    showVotes,
    createdAt,
    lastVoteTimestamp,
    addUser,
    removeUser,
    setSharedText,
    handleVote,
    toggleClearVotes,
    toggleShowVotes,
    updateUserName,
    getActiveUsersUids,
    leaderOnly,
    toggleLeaderOnlyActions,
  } = useRoom(params.slug);

  const [isCopied, setIsCopied] = useState(false);
  const [ownerSharedTextInput, setOwnerSharedTextInput] = useState(sharedText);

  useEffect(() => {
    let uid: string;
    if (user?.uid && user?.displayName) {
      uid = user.uid;
      if (user?.displayName) {
        addUser();
      }
    }
    return (uid) => (uid ? removeUser(uid) : {});
    // eslint-disable-next-line
  }, [user?.uid]);

  const debouncedOwnerSharedText = useDebounce(ownerSharedTextInput, 1000);

  useEffect(() => {
    // Update db with new shared text
    setSharedText(debouncedOwnerSharedText);
  }, [debouncedOwnerSharedText]);

  const roomCreator = users[ownerId]?.name;
  const isOwner = user?.uid && ownerId === user?.uid;

  if (!user) {
    return <PageLoad />;
  }

  // Set user displayName if it doesnt exist
  if (user && !user.displayName) {
    return (
      <main className="flex justify-center md:p-12">
        <NameCard addUser={addUser} />
      </main>
    );
  }

  const copyRoomLink = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <main className="flex justify-center md:p-12">
      <Card
        title={
          <p className="flex justify-center">
            Welcome {user?.displayName} to room{" "}
            <span className="group">
              <button
                className="flex mx-2 text-blue hover:opacity-50"
                onClick={copyRoomLink}
              >
                {params.slug}
                <ClipboardDocumentCheckIcon width={24} height={24} />
              </button>
              <span
                id="tooltip-copied"
                role="tooltip"
                className={`absolute scale-0 rounded bg-gray-800 p-2 text-xs text-white ${
                  isCopied ? "scale-100" : "scale-0"
                }`}
              >
                Copied Link!
                <span className="tooltip-arrow" data-popper-arrow />
              </span>
            </span>
          </p>
        }
      >
        <div className="min-w-full">
          <div className="grid md:grid-cols-2 gap-4">
            <textarea
              placeholder={`Description set by ${roomCreator}`}
              rows={2}
              disabled={!isOwner}
              className="resize-none"
              value={isOwner ? ownerSharedTextInput : sharedText}
              onChange={
                isOwner
                  ? (e) => setOwnerSharedTextInput(e.target.value)
                  : undefined
              }
            />
            <div>
              <RoomTimer
                createdAtTimestamp={createdAt}
                lastVoteTimestamp={lastVoteTimestamp}
              />
              <RoomVoteControls
                showVotes={showVotes}
                isOwner={user.uid === ownerId}
                leaderOnly={leaderOnly}
                handleOwnerLockChange={toggleLeaderOnlyActions}
                handleClearVotes={toggleClearVotes}
                handleShowVotes={toggleShowVotes}
              />
            </div>
          </div>
          <hr />
          {/* Content: Vote Buttons and User List */}
          <div className="grid md:grid-cols-2 gap-4 py-4">
            {/* Vote Buttons */}
            <div className="grid grid-cols-3 gap-4">
              {ROOM_BUTTON_VALUES.map((buttonVal) => (
                <button
                  key={`btn-${buttonVal}`}
                  className=" bg-blue text-white font-bold text-xl rounded-md hover:opacity-50 shadow-lg"
                  onClick={() => handleVote(buttonVal)}
                >
                  {buttonVal}
                </button>
              ))}
            </div>

            {/* User List */}
            <RoomUsersList
              showVotes={showVotes}
              ownerUid={ownerId}
              users={users}
              updateUserName={updateUserName}
              removeUser={removeUser}
            />
          </div>
        </div>
      </Card>
    </main>
  );
}
