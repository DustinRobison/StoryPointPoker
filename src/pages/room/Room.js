import React, { useContext, useEffect } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Redirect, useParams, useLocation } from "react-router-dom";
import { Paper, Typography, Link, Divider, Grid } from "@material-ui/core";
import { isObject } from "lodash";

import { AuthContext } from "../../components/auth/Auth";
import NameForm from "./NameForm";
import LoadingPage from "../../components/loading/LoadingPage";
import ButtonGrid from "./ButtonGrid";
import RoomHeader from "./RoomHeader";
import Results from "./Results";
import { useRoom } from "./DbRoom";

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
  }
}));

const Room = () => {
  const classes = useStyles();
  const { id } = useParams();
  const { pathname } = useLocation();
  const { currentUser } = useContext(AuthContext);
  const roomData = useRoom(id);
  const {
    loading,
    error,
    exists,
    ownerId,
    users,
    messages,
    sharedText,
    showVotes,
    lastVoteTimestamp,
    addUser,
    removeUser,
    setSharedText,
    handleVote,
    setShowVotes,
    clearVotes,
    updateUserName
  } = roomData;

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

  const clearAllUserVotes = () => {
    clearVotes(Object.keys(users));
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.contentContainer}>
        <Typography variant={"h5"}>
          Welcome {currentUser.displayName} to room{" "}
          <Link href={pathname}>{id}</Link>
        </Typography>
        <Typography variant={"subtitle1"}>
          Invite link:{" "}
          <Link href={pathname}>
            {`${window.location.protocol}//${window.location.hostname}${pathname}`}
          </Link>
        </Typography>
        <Divider />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <RoomHeader
              messages={messages}
              lastVoteTimestamp={lastVoteTimestamp}
              sharedText={sharedText}
              setSharedText={setSharedText}
              clearVotes={clearAllUserVotes}
              showVotes={showVotes}
              setShowVotes={setShowVotes}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <ButtonGrid handleVote={handleVote} />
          </Grid>
          <Grid item sm={6} xs={12}>
            <Results
              isOwner={ownerId === currentUser.uid}
              showVotes={showVotes}
              users={
                isObject(users)
                  ? Object.keys(users)
                      .filter(key => users[key].active)
                      .map(key => ({
                        ...users[key],
                        isCurrentUser: key === currentUser.uid,
                        uid: key
                      }))
                  : []
              }
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
