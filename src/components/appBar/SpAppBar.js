import React from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { AppBar, Toolbar, Link, Typography } from "@material-ui/core";
import { HomeLink } from "../links/SpLink";

const useStyles = makeStyles(({ spacing }) => ({
  root: {}
}));

const SpAppBar = ({ height }) => {
  const classes = useStyles();
  return (
    <AppBar className={classes.root}>
      <Toolbar>
        <Link component={HomeLink} color={"inherit"} underline={"none"}>
          <Typography variant={"h3"}>StoryPointers</Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

SpAppBar.propTypes = {
  height: PropTypes.number.isRequired
};

export default SpAppBar;
