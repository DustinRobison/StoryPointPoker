import React, { useEffect, useRef } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useLocation } from "react-router-dom";
import JoinRoom from "./JoinRoom";
import About from "./About";

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    padding: spacing(3)
  },
  contentContainer: {
    [breakpoints.up("md")]: {
      width: "50rem",
      marginLeft: "auto",
      marginRight: "auto"
    },
    marginBottom: spacing(3)
  }
}));

const Home = () => {
  const classes = useStyles();
  const aboutRef = useRef();
  const location = useLocation();
  const hash = location.hash;

  useEffect(() => {
    document.title = `Story Point Poker`;
  }, []);

  useEffect(() => {
    if (hash === "#about") {
      aboutRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "center"
      });
    }
  }, [hash]);

  return (
    <div className={classes.root}>
      <div className={classes.contentContainer}>
        <JoinRoom />
      </div>
      <div className={classes.contentContainer}>
        <About reference={aboutRef} />
      </div>
    </div>
  );
};

export default Home;
