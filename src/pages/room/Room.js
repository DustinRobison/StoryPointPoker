import React, { useContext, useEffect, useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Redirect, useParams, useLocation } from "react-router-dom";
import { Paper, Typography, Link, Divider, Grid } from "@material-ui/core";

import { AuthContext } from "../../components/auth/Auth";
import NameForm from "./NameForm";
import LoadingPage from "../../components/loading/LoadingPage";
import ButtonGrid from "./ButtonGrid";
import RoomHeader from "./RoomHeader";
import Results from "./Results";
import { checkIfRoomExists, useRoom } from "../../helpers/DbRoom";

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

const SHOW_VOTES = false;

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
    messages,
    sharedText,
    addUser,
    removeUser,
    setSharedText,
    handleVote,
    showVotes,
    clearVotes
  } = roomData;

  useEffect(() => {
    if (currentUser && currentUser.displayName) {
      addUser();
    }
    return () => removeUser();
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
    return <NameForm />;
  }

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
              sharedText={sharedText}
              setSharedText={setSharedText}
              clearVotes={clearVotes}
              showVotes={showVotes}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <ButtonGrid handleVote={handleVote} />
          </Grid>
          <Grid item sm={6} xs={12}>
            <Results showVotes={SHOW_VOTES} />
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default Room;
