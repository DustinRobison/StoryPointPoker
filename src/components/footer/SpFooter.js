import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Typography, Link } from "@material-ui/core";

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    padding: spacing(3)
  }
}));

const SpFooter = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography align={"center"}>
        Built with care by{" "}
        <Link href={"https://github.com/DustinRobison"}>Dustin Robison</Link>{" "}
      </Typography>
    </div>
  );
};

export default SpFooter;
