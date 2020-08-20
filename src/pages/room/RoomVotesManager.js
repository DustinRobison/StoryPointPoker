import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox
} from "@material-ui/core";
import PropTypes from "prop-types";

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    paddingTop: spacing(3),
    paddingBottom: spacing(3),
    display: "flex",
    justifyContent: "space-around"
  }
}));

const RoomVotesManager = ({
  showVotes,
  clearVotes,
  setShowVotes,
  isOwner,
  roomCreatorName,
  leaderOnly,
  toggleLeaderOnlyActions
}) => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.root}>
        <Button
          variant={"contained"}
          color={"primary"}
          onClick={() => {
            clearVotes();
          }}
          disabled={!isOwner && leaderOnly}
        >
          Clear Votes
        </Button>
        <Button
          variant={"contained"}
          color={"primary"}
          onClick={() => setShowVotes(!showVotes)}
          disabled={!isOwner && leaderOnly}
        >
          {showVotes ? "Hide Votes" : "Show Votes"}
        </Button>
      </div>
      <div>
        {isOwner ? (
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={leaderOnly}
                  onChange={() => toggleLeaderOnlyActions()}
                  name="leaderOnly"
                  color="primary"
                />
              }
              label={`Only ${roomCreatorName} can show, hide, clear vote controls`}
            />
          </FormGroup>
        ) : null}
      </div>
    </>
  );
};

RoomVotesManager.propTypes = {
  showVotes: PropTypes.bool,
  clearVotes: PropTypes.func,
  setShowVotes: PropTypes.func,
  isOwner: PropTypes.bool,
  leaderOnly: PropTypes.bool,
  toggleLeaderOnlyActions: PropTypes.func,
  roomCreatorName: PropTypes.string
};

export default RoomVotesManager;
