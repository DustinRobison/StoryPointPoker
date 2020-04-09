import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Button } from "@material-ui/core";
import PropTypes from "prop-types";

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    paddingTop: spacing(3),
    paddingBottom: spacing(3),
    display: "flex",
    justifyContent: "space-around"
  }
}));

const RoomVotesManager = ({ showVotes, clearVotes, setShowVotes }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
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
  );
};

RoomVotesManager.propTypes = {
  showVotes: PropTypes.bool,
  clearVotes: PropTypes.func,
  setShowVotes: PropTypes.func
};

export default RoomVotesManager;
