import React, { useEffect } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useStopwatch } from "react-timer-hook";
import { Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import RoomResults from "./RoomResults";

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    padding: spacing(3)
  }
}));

const RoomTimer = () => {
  const classes = useStyles();
  const { seconds, minutes, hours, reset, pause, start } = useStopwatch({
    autoStart: true
  });
  useEffect(() => {
    if (lastVoteTimestamp) {
      reset();
    }
    // eslint-disable-next-line
  }, [lastVoteTimestamp]);

  return (
    <div className={classes.root}>
      <Typography variant={"h6"} align={"center"}>
        {hours >= 10 ? `${hours}` : `0${hours}`}:
        {minutes >= 10 ? `${minutes}` : `0${minutes}`}:
        {seconds >= 10 ? `${seconds}` : `0${seconds}`}
      </Typography>
    </div>
  );
};

RoomResults.propTypes = {
  lastVoteTimestamp: PropTypes.number.isRequired
};

export default RoomTimer;
