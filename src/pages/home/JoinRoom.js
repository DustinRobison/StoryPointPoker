import React, { useContext, useEffect, useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Paper, Button, Grid, TextField, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useDebounce } from "../../helpers/Debounce";
import FirebaseApp from "../../Firebase";
import { AuthContext } from "../../components/auth/Auth";
import { checkIfRoomExists } from "../../helpers/DbRoom";

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    padding: spacing(3),
    minHeight: "15rem"
  }
}));

const JoinRoom = () => {
  const classes = useStyles();
  const history = useHistory();
  const { currentUser } = useContext(AuthContext);
  const [state, setState] = useState({
    roomName: "",
    loading: false,
    error: "",
    exists: false
  });
  const { roomName, loading, error, exists } = state;
  const debouncedRoomName = useDebounce(roomName, 800);

  useEffect(() => {
    if (debouncedRoomName && debouncedRoomName.length > 3) {
      setState({
        ...state,
        loading: true,
        error: ""
      });
      checkIfRoomExists(debouncedRoomName)
        .then(roomExists =>
          setState({
            ...state,
            exists: roomExists,
            loading: false,
            error: ""
          })
        )
        .catch(error =>
          setState({
            ...state,
            loading: false,
            error: error.message
          })
        );
    }
    // eslint-disable-next-line
  }, [debouncedRoomName]);

  const joinRoom = async () => {
    history.push(`/room/${roomName}`);
  };

  const createRoom = async () => {
    try {
      setState({
        ...state,
        loading: true
      });
      await FirebaseApp.firestore()
        .collection("rooms")
        .doc(debouncedRoomName)
        .set({
          ownerId: currentUser.uid,
          messages: [],
          users: {},
          sharedText: "",
          showVotes: false
        });
      history.push(`/room/${roomName}`);
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        error: error.message
      });
    }
  };

  return (
    <Paper className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant={"h6"} align={"center"}>
            Create or Join a Room
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label={"Room Name"}
            helperText={"Numbers and letters only"}
            fullWidth
            inputProps={{ style: { textAlign: "center" } }}
            value={roomName}
            onChange={e =>
              setState({
                ...state,
                roomName: e.target.value
              })
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant={"contained"}
            fullWidth
            disabled={roomName.length < 4 || loading || error || !exists}
            onClick={joinRoom}
          >
            Join
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant={"contained"}
            fullWidth
            disabled={roomName.length < 4 || loading || error || exists}
            onClick={createRoom}
          >
            Create Room {debouncedRoomName}
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography color={"error"} align={"center"}>
            {error}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default JoinRoom;
