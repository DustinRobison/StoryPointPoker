import React, { useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Paper, Button, Grid, TextField, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    padding: spacing(3),
    minHeight: "15rem"
  }
}));

const JoinRoom = () => {
  const classes = useStyles();
  const [roomNumber, setRoomNumber] = useState("");
  const history = useHistory();

  const joinRoom = () => {
    history.push(`/session/${roomNumber}`);
  };

  return (
    <Paper className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant={"h6"} align={"center"}>
            Join a room
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label={"Room Number"}
            fullWidth
            inputProps={{ style: { textAlign: "center" } }}
            type={"number"}
            value={roomNumber}
            onChange={e => setRoomNumber(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant={"contained"}
            fullWidth
            disabled={!Boolean(roomNumber)}
            onClick={joinRoom}
          >
            Join
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default JoinRoom;
