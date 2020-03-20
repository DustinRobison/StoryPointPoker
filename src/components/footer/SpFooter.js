import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Typography, Link } from "@material-ui/core";

const useStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    padding: spacing(1),
    display: "flex",
    justifyContent: "space-between",
    background: palette.primary.dark,
    color: palette.primary.contrastText
  }
}));

const SpFooter = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography>Copyright © 2020 - Dustin Robison </Typography>
      <Typography>
        Built with care by{" "}
        <Link color={"secondary"} href={"https://github.com/DustinRobison"}>
          Dustin Robison
        </Link>{" "}
      </Typography>
    </div>
  );
};

export default SpFooter;
