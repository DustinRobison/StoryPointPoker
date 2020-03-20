import React, { useContext } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Redirect, useParams, useLocation } from "react-router-dom";
import { Paper, Typography, Link } from "@material-ui/core";

import { AuthContext } from "../../components/auth/Auth";
import NameForm from "./NameForm";
import LoadingPage from "../../components/loading/LoadingPage";

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    padding: spacing(3)
  },
  contentContainer: {
    padding: spacing(3),
    [breakpoints.up("md")]: {
      width: "30rem",
      marginLeft: "auto",
      marginRight: "auto"
    }
  }
}));

const Session = () => {
  const classes = useStyles();
  const { id } = useParams();
  const { pathname } = useLocation();
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <LoadingPage />;
  }

  if (!id) {
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
            {window.location.protocol}//{window.location.hostname}
            {pathname}
          </Link>
        </Typography>
        <div>content</div>
      </Paper>
    </div>
  );
};

export default Session;
