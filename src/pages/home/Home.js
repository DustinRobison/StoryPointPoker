import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Grid } from "@material-ui/core";
import CreateRoom from "./CreateRoom";
import JoinRoom from "./JoinRoom";

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    padding: spacing(3)
  },
  contentContainer: {
    [breakpoints.up("md")]: {
      width: "50rem",
      marginLeft: "auto",
      marginRight: "auto"
    }
  }
}));

const Home = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={3} className={classes.contentContainer}>
        <Grid item xs={12} sm={6}>
          <CreateRoom />
        </Grid>
        <Grid item xs={12} sm={6}>
          <JoinRoom />
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
