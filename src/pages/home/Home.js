import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
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
      <div className={classes.contentContainer}>
        <JoinRoom />
      </div>
    </div>
  );
};

export default Home;
