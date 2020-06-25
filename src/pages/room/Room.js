import React, { useContext, useEffect, useRef, useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Redirect, useParams, useLocation } from "react-router-dom";
import {
  Paper,
  Typography,
  Link,
  Divider,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip
} from "@material-ui/core";
import { FileCopy } from "@material-ui/icons";

import { AuthContext } from "../../components/auth/Auth";
import NameForm from "./NameForm";
import LoadingPage from "../../components/loading/LoadingPage";
import ButtonGrid from "./ButtonGrid";
import { useRoom } from "./DbRoom";
import RoomVotesManager from "./RoomVotesManager";
import RoomResults from "./RoomResults";
import RoomTimer from "./RoomTimer";
import MessageInput from "../../components/message/MessageInput";
import RoomUsersList from "./RoomUsersList";

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    padding: spacing(3)
  },
  contentContainer: {
    padding: spacing(3),
    [breakpoints.up("md")]: {
      maxWidth: "55rem",
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  linkFieldContainer: {
    paddingTop: spacing(2),
    paddingBottom: spacing(1),
    flex: "inline-block",
    minWidth: "19rem"
  }
}));

const Room = () => {
  const classes = useStyles();
  const { id } = useParams();
  const { pathname } = useLocation();
  const { currentUser } = useContext(AuthContext);
  const linkFieldRef = useRef(null);
  const roomData = useRoom(id);
  const {
    loading,
    error,
    exists,
    ownerId,
    users,
    sharedText,
    // messages,
    showVotes,
    lastVoteTimestamp,
    addUser,
    removeUser,
    setSharedText,
    handleVote,
    setShowVotes,
    clearVotes,
    updateUserName,
    getActiveUsersUids,
    leaderOnly,
    toggleLeaderOnlyActions
  } = roomData;
  const isOwner = currentUser && currentUser.uid && ownerId === currentUser.uid;
  const [isCopied, setIsCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    document.title = `SPP: ${id}`;
  }, [id]);

  useEffect(() => {
    let uid;
    if (currentUser && currentUser.uid && currentUser.displayName) {
      uid = currentUser.uid;
      if (currentUser && currentUser.displayName) {
        addUser();
      }
    }
    return () => (uid ? removeUser(uid) : {});
    // eslint-disable-next-line
  }, [currentUser]);

  // Loading while waiting for user
  if (loading || !currentUser) {
    return <LoadingPage />;
  }

  // Redirect home if room doesnt exists
  if (!exists) {
    return <Redirect to={"/"} />;
  }

  if (currentUser && !currentUser.displayName) {
    return <NameForm addUser={addUser} />;
  }

  const handleCopy = e => {
    setIsCopied(true);
    linkFieldRef.current.select();
    document.execCommand("copy");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.contentContainer}>
        <Typography variant={"h5"}>
          Welcome {currentUser.displayName} to room{" "}
          <Link href={pathname}>{id}</Link>
        </Typography>
        <div className={classes.linkFieldContainer}>
          <TextField
            label={"Room link"}
            variant={"filled"}
            fullWidth
            inputRef={linkFieldRef}
            InputProps={{
              endAdornment: (
                <InputAdornment>
                  <Tooltip
                    title={isCopied ? "Copied!" : "Copy to clipboard"}
                    open={tooltipOpen || isCopied}
                    onOpen={() => setTooltipOpen(true)}
                    onClose={() => setTooltipOpen(false)}
                  >
                    <IconButton onClick={handleCopy}>
                      <FileCopy fontSize={"small"} />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              )
            }}
            value={`${window.location.protocol}//${window.location.hostname}${pathname}`}
            onChange={() => {}}
            onFocus={e => e.target.select()}
          />
        </div>
        <Divider />
        <Grid container spacing={3}>
          <Grid item sm={6} xs={12}>
            <MessageInput
              label={"Description set by room leader"}
              readOnly={!isOwner}
              parentMessage={sharedText}
              submitMessage={setSharedText}
            />
            <RoomVotesManager
              setShowVotes={setShowVotes}
              showVotes={showVotes}
              clearVotes={clearVotes}
              isOwner={isOwner}
              leaderOnly={leaderOnly}
              toggleLeaderOnlyActions={toggleLeaderOnlyActions}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            {showVotes ? (
              <RoomResults
                showVotes={showVotes}
                lastVoteTimestamp={lastVoteTimestamp}
                votes={getActiveUsersUids().map(
                  activeUid => users[activeUid].vote
                )}
              />
            ) : (
              <RoomTimer lastVoteTimestamp={lastVoteTimestamp} />
            )}
          </Grid>
          <Grid item sm={6} xs={12}>
            <ButtonGrid handleVote={handleVote} />
          </Grid>
          <Grid item sm={6} xs={12}>
            <RoomUsersList
              isOwner={isOwner}
              showVotes={showVotes}
              users={getActiveUsersUids().map(key => ({
                ...users[key],
                isCurrentUser: key === currentUser.uid,
                uid: key
              }))}
              removeUser={removeUser}
              updateUserName={updateUserName}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant={"h5"} color={"error"} align={"center"}>
              {error}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default Room;
