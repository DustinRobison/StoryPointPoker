import React, { useState, useEffect } from "react";
import { formatDistance } from "date-fns";

const DURATION_FORMAT = {
  format: ["hours", "minutes", "seconds"],
  delimiter: ":",
};

interface RoomTimerProps {
  createdAtTimestamp: any;
  lastVoteTimestamp: any;
}

export default function RoomTimer({
  lastVoteTimestamp,
  createdAtTimestamp,
}: RoomTimerProps) {
  const [sessionTime, setSessionTime] = useState("");
  const [currentVoteTime, setCurrentVoteTime] = useState("");

  useEffect(() => {
    let interval;
    if (lastVoteTimestamp && createdAtTimestamp) {
      interval = setInterval(
        () => getTime(createdAtTimestamp, lastVoteTimestamp),
        1000
      );
    }
    return () => clearInterval(interval);
  }, [lastVoteTimestamp?.seconds]);

  if (!lastVoteTimestamp) {
    return <div />;
  }

  const getTime = (sessionStart, lastVote) => {
    setSessionTime(
      formatDistance(new Date(), new Date(sessionStart.seconds * 1000))
    );
    setCurrentVoteTime(
      formatDistance(new Date(), new Date(lastVote.seconds * 1000))
    );
  };

  return (
    <div className="grid grid-cols-2 gap-1">
      <div>Session:</div>
      <div>{sessionTime}</div>
      <div>Current:</div>
      <div>{currentVoteTime}</div>
    </div>
  );
}
