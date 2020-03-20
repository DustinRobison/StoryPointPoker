import React, { useContext, useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Paper, Button, Grid, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import { AuthContext } from "../../components/auth/Auth";

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    padding: spacing(3),
    minHeight: "15rem"
  }
}));

const CreateRoom = () => {
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();
  const [state, setState] = useState({
    error: "",
    isLoading: false
  });
  const { error, isLoading } = state;

  const createRoom = async () => {
    try {
      const request = await fetch(
        `https://us-central1-storypointers.cloudfunctions.net/createRoom`,
        {
          method: "POST",
          mode: "no-cors",
          header: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST"
          },
          body: JSON.stringify({ userId: currentUser.uid })
        }
      );
      console.log(request);
      const res = await request.json();
      console.log(res);
      history.push(`/session/${res.room}`);
    } catch (error) {
      console.log(`error: ${error}`);
      setState({
        error: error.message,
        isLoading: false
      });
    }
  };

  // initializeRoom()
  //   .then(res => history.push(`/session/${res}`))
  //   .catch(error => {
  //     console.log(error);
  //     setError(error.message);
  //   });

  return (
    <Paper className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant={"h6"} align={"center"}>
            Create a room
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Button
            color={"secondary"}
            variant={"contained"}
            fullWidth
            onClick={createRoom}
            disabled={isLoading}
          >
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12}>
          {error ? <Typography color={"error"}>{error}</Typography> : null}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CreateRoom;
