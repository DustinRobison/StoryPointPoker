import { FirebaseContext } from "@/context/FirebaseContext";
import { IUser } from "@/firebase/db-room";
import React, { useContext, useState } from "react";
import {
  ClockIcon,
  PencilSquareIcon,
  TrashIcon,
  XCircleIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

interface RoomUsersListProps {
  showVotes: boolean;
  ownerUid: string;
  users: { [key: string]: IUser };
  updateUserName: Function;
  removeUser: Function;
}

export default function RoomUsersList({
  showVotes,
  ownerUid,
  users,
  updateUserName,
  removeUser,
}: RoomUsersListProps) {
  const { user, firestore } = useContext(FirebaseContext);
  const [isEditingName, setIsEditingName] = useState(false);
  const [inputName, setInputName] = useState(user?.displayName || "");

  const activeUsersIds = Object.keys(users)
    .filter((userUid) => users[userUid]?.active)
    .sort((userUidA, userUidB) => {
      if (users[userUidA]?.name < users[userUidB]?.name) {
        return -1;
      }
      if (users[userUidA]?.name > users[userUidB]?.name) {
        return 1;
      }
      return 0;
    });

  const votesObject = activeUsersIds.reduce(
    (acc, uid) => {
      const vote = Number(users[uid].vote);
      if (isNaN(vote)) {
        return {
          ...acc,
          abstain: acc.abstain + 1,
        };
      }
      return {
        votes: [...acc.votes, vote],
        abstain: acc.abstain,
      };
    },
    { votes: [], abstain: 0 }
  );

  const average = (numArray: number[]) => {
    if (numArray.length <= 0) {
      return 0.0;
    }
    return (
      Math.round((numArray.reduce((a, b) => a + b) / numArray.length) * 100) /
      100
    );
  };

  const startEdit = () => {
    setIsEditingName(true);
    setInputName(user?.displayName || "");
  };

  const cancelEdit = () => {
    setIsEditingName(false);
    setInputName(user?.displayName || "");
  };

  const saveEdit = () => {
    updateUserName(inputName);
    setIsEditingName(false);
  };

  return (
    <div>
      <div
        className={`ml-4 pb-2 ${
          showVotes ? "font-bold" : ""
        } flex justify-between`}
      >
        <div className="flex">
          Average:
          <span className="ml-2">
            {showVotes ? (
              average(votesObject.votes)
            ) : (
              <ClockIcon height={24} width={24} className="" />
            )}
          </span>
        </div>
        <div className="flex">
          Abstain:
          <span className="ml-2">
            {showVotes ? (
              votesObject.abstain
            ) : (
              <ClockIcon height={24} width={24} className="" />
            )}
          </span>
        </div>
      </div>
      <hr />
      <ul className="flex flex-col">
        {Array.isArray(activeUsersIds)
          ? activeUsersIds.map((uid) => {
              return (
                <li
                  key={`usr-${uid}`}
                  className="grid grid-cols-[32px_1fr_64px] gap-1"
                >
                  <>
                    {showVotes || (uid === user?.uid && users[uid]?.vote) ? (
                      <span className="text-center font-bold">
                        {users[uid]?.vote}
                      </span>
                    ) : (
                      <ClockIcon height={24} width={24} className="" />
                    )}
                  </>
                  <div className="text-left">
                    {!isEditingName || user?.uid !== uid ? (
                      users[uid].name
                    ) : (
                      <input
                        type="text"
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                      />
                    )}
                  </div>
                  <div className="text-center">
                    {uid === user?.uid && isEditingName ? (
                      <span className="flex">
                        <button onClick={cancelEdit}>
                          <XCircleIcon width={24} height={24} />
                        </button>
                        <button onClick={saveEdit}>
                          <CheckIcon width={24} height={24} className="ml-4" />
                        </button>
                      </span>
                    ) : uid === user?.uid ? (
                      <button>
                        <PencilSquareIcon
                          width={24}
                          height={24}
                          onClick={startEdit}
                        />
                      </button>
                    ) : user?.uid === ownerUid ? (
                      <button onClick={() => removeUser(uid)}>
                        <TrashIcon width={24} height={24} />
                      </button>
                    ) : null}
                  </div>
                </li>
              );
            })
          : null}
      </ul>
    </div>
  );
}
