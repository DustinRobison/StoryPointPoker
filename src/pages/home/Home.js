import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    padding: spacing(3)
  }
}));

const Home = () => {
  const classes = useStyles();
  return <div>Home</div>;
};

export default Home;
