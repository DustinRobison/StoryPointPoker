import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ForkMeSvg from "../../assets/Forkme.svg";

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    float: "right",
    zIndex: 10
  }
}));

const ForkGithub = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <a
        href="https://github.com/DustinRobison/StoryPointPoker"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={ForkMeSvg} alt={"Fork me on github!"} />
      </a>
    </div>
  );
};

export default ForkGithub;
