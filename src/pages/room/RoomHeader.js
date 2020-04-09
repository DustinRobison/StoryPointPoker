import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import Timer from "react-compound-timer";

const useStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    paddingTop: spacing(3)
  },
  buttonContainer: {
    paddingTop: spacing(1),
    paddingBottom: spacing(1),
    display: "flex",
    justifyContent: "space-around"
  },
  messageContainer: {
    height: "10rem",
    border: `1px solid ${palette.primary.light}`,
    paddingBottom: spacing(1)
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%"
  }
}));

const RoomHeader = ({
  lastVoteTimestamp,
  messages,
  sharedText,
  setSharedText,
  clearVotes,
  showVotes,
  setShowVotes
}) => {
  const classes = useStyles();
  const [state, setState] = useState({
    loading: false,
    message: ""
  });
  const initialTime =
    lastVoteTimestamp === 0
      ? 0
      : Math.floor(Date.now() / 1000) - lastVoteTimestamp;

  const handleMessageSubmit = e => {
    e.preventDefault();
    if (state.message) {
      console.log("submit");
      setState({
        ...state,
        loading: true
      });
    }
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item sm={9} xs={12}>
          <div className={classes.buttonContainer}>
            <Button
              variant={"contained"}
              color={"primary"}
              onClick={() => {
                clearVotes();
              }}
            >
              Clear Votes
            </Button>
            <Button
              variant={"contained"}
              color={"primary"}
              onClick={() => setShowVotes(!showVotes)}
            >
              {showVotes ? "Hide Votes" : "Show Votes"}
            </Button>
          </div>
        </Grid>
        <Grid item sm={3} xs={12}>
          {lastVoteTimestamp === 0 ? (
            <Skeleton variant={"text"} width={200} height={40} />
          ) : (
            <Timer
              initialTime={initialTime}
              formatValue={value => `${value < 10 ? `0${value}` : value}`}
            >
              <Typography variant={"h5"} align={"center"}>
                <Timer.Hours />:
                <Timer.Minutes />:
                <Timer.Seconds />
              </Typography>
            </Timer>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

RoomHeader.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object),
  lastVoteTimestamp: PropTypes.number.isRequired,
  showVotes: PropTypes.bool,
  sharedText: PropTypes.string,
  setSharedText: PropTypes.func,
  clearVotes: PropTypes.func,
  setShowVotes: PropTypes.func
};

export default RoomHeader;
