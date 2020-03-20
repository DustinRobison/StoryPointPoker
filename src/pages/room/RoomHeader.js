import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import Timer from "react-compound-timer";

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    paddingTop: spacing(3)
  },
  buttonContainer: {
    paddingTop: spacing(1),
    paddingBottom: spacing(1),
    display: "flex",
    justifyContent: "space-around"
  }
}));

const RoomHeader = ({ sharedText, setSharedText, clearVotes, showVotes }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Timer formatValue={value => `${value < 10 ? `0${value}` : value}`}>
        {({ reset }) => (
          <Grid container spacing={3}>
            <Grid item sm={9} xs={12}>
              <TextField
                label={"Shared Open Text"}
                variant={"outlined"}
                multiline
                rows={3}
                fullWidth
                value={sharedText}
                onChange={e => setSharedText(e.target.value)}
              />
              <div className={classes.buttonContainer}>
                <Button
                  variant={"contained"}
                  color={"primary"}
                  onClick={() => {
                    reset();
                    clearVotes();
                  }}
                >
                  Clear Votes
                </Button>
                <Button
                  variant={"contained"}
                  color={"primary"}
                  onClick={() => showVotes()}
                >
                  Show Votes
                </Button>
              </div>
            </Grid>
            <Grid item sm={3} xs={12}>
              <Typography variant={"h5"} align={"center"}>
                <Timer.Hours />:
                <Timer.Minutes />:
                <Timer.Seconds />
              </Typography>
            </Grid>
          </Grid>
        )}
      </Timer>
    </div>
  );
};

RoomHeader.propTypes = {
  sharedText: PropTypes.string,
  setSharedText: PropTypes.func,
  clearVotes: PropTypes.func,
  showVotes: PropTypes.func
};

export default RoomHeader;
