import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    padding: spacing(3),
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
}));

const LoadingPage = () => {
  const classes = useStyles();
  return <div className={classes.root}>Loading</div>;
};

export default LoadingPage;
