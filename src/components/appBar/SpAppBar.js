import React from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  AppBar,
  Toolbar,
  Link,
  Typography,
  useMediaQuery,
  Divider
} from "@material-ui/core";
import Accuracy from "../../assets/Accuracy.png";
import ForkGithub from "../fork/ForkGithub";

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    position: "relative"
  },
  forkImageContainer: {
    position: "absolute",
    top: 80,
    right: 0
  },
  mainLink: {
    display: "flex",
    alignItems: "center"
  },
  secondaryLinks: {
    marginLeft: spacing(3),
    display: "flex",
    alignItems: "end",
    textAlign: "center"
  }
}));

const SpAppBar = ({ height }) => {
  const classes = useStyles();
  const isDesktop = useMediaQuery("(min-width:600px)");
  return (
    <AppBar className={classes.root} style={{ height }}>
      <Toolbar>
        <div className={classes.mainLink}>
          <Link
            component={RouterLink}
            to={"/"}
            color={"inherit"}
            underline={"none"}
          >
            <img src={Accuracy} alt={"Story Point Poker Icon"} />
          </Link>
          <Link
            component={RouterLink}
            to={"/"}
            color={"inherit"}
            underline={"none"}
          >
            <Typography variant={isDesktop ? "h4" : "h6"}>
              Story Point Poker
            </Typography>
          </Link>
        </div>
        <div className={classes.secondaryLinks}>
          <Link
            component={RouterLink}
            to={"/#about"}
            color={"inherit"}
            underline={"none"}
          >
            <Divider orientation="vertical" flexItem color={"inherit"} />
            <Typography variant={isDesktop ? "h6" : "subtitle1"}>
              About
            </Typography>
            <Divider orientation="vertical" flexItem color={"inherit"} />
          </Link>
        </div>
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
