import React from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  AppBar,
  Toolbar,
  Link,
  Typography,
  useMediaQuery
} from "@material-ui/core";
import { HomeLink } from "../links/SpLink";
import Accuracy from "../../assets/Accuracy.png";
import ForkGithub from "../fork/ForkGithub";

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    position: "relative"
  },
  forkImageContainer: {
    position: "absolute",
    top: 0,
    right: 0
  }
}));

const SpAppBar = ({ height }) => {
  const classes = useStyles();
  const isDesktop = useMediaQuery("(min-width:600px)");
  return (
    <AppBar className={classes.root} style={{ height }}>
      <Toolbar>
        <Link component={HomeLink} color={"inherit"} underline={"none"}>
          <img src={Accuracy} alt={"Story Point Poker Icon"} />
        </Link>
        <Link component={HomeLink} color={"inherit"} underline={"none"}>
          <Typography variant={isDesktop ? "h3" : "h4"}>
            Story Point Poker
          </Typography>
        </Link>
      </Toolbar>
      <div className={classes.forkImageContainer}>
        <ForkGithub />
      </div>
    </AppBar>
  );
};

SpAppBar.propTypes = {
  height: PropTypes.number.isRequired
};

export default SpAppBar;
