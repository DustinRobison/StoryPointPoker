import React from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { AppBar, Toolbar, Link, Typography } from "@material-ui/core";
import { HomeLink } from "../links/SpLink";
import Accuracy from "../../assets/Accuracy.png";

const useStyles = makeStyles(({ spacing }) => ({
  root: {}
}));

const SpAppBar = ({ height }) => {
  const classes = useStyles();
  return (
    <AppBar className={classes.root} style={{ height }}>
      <Toolbar>
        <Link component={HomeLink} color={"inherit"} underline={"none"}>
          <img src={Accuracy} alt={"Story Point Poker Icon"} />
        </Link>
        <Link component={HomeLink} color={"inherit"} underline={"none"}>
          <Typography variant={"h3"}>Story Point Poker</Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

SpAppBar.propTypes = {
  height: PropTypes.number.isRequired
};

export default SpAppBar;
