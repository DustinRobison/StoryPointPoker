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
  const [error, setError] = useState();

  const createRoom = () => {
    initializeRoom()
      .then(res => history.push(`/session/${res}`))
      .catch(error => setError(error));
  };

  const initializeRoom = () => {
    if (!currentUser) {
      return Promise.reject("Cannot create room for null user!");
    }
    return Promise.resolve("1");
  };

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
