import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    padding: spacing(3)
  },
  contentContainer: {
    [breakpoints.up("md")]: {
      width: "30rem",
      marginLeft: "auto",
      marginRight: "auto"
    }
  }
}));

const Home = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={3} className={classes.contentContainer}>
        <Grid item xs={12} sm={6}>
          <Typography variant={"h6"} align={"center"}>
            Create a room
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant={"h6"} align={"center"}>
            Join a room
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
