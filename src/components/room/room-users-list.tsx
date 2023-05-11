import { AuthContext } from "@/context/AuthContext";
import { IUser } from "@/firebase/db-room";
import React, { useContext } from "react";
import {
  ClockIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface RoomUsersListProps {
  showVotes: boolean;
  ownerUid: string;
  users: { [key: string]: IUser };
  updateUserName: Function;
  removeUser?: Function;
}

export default function RoomUsersList({
  showVotes,
  ownerUid,
  users,
  updateUserName,
  removeUser,
}: RoomUsersListProps) {
  const { user } = useContext(AuthContext);

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

  return (
    <ul className="flex flex-col">
      {Array.isArray(activeUsersIds)
        ? activeUsersIds.map((uid) => {
            return (
              <li
                key={`usr-${uid}`}
                className="grid grid-cols-[32px_1fr_32px] gap-1"
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
                <div className="text-left">{users[uid].name}</div>
                <div className="text-center">
                  {uid === user?.uid ? (
                    <button>
                      <PencilSquareIcon width={24} height={24} />
                    </button>
                  ) : user?.uid === ownerUid ? (
                    <button>
                      <TrashIcon width={24} height={24} />
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })
        : null}
    </ul>
  );
}
