import React, { useContext, useEffect, useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  Paper,
  Button,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  CircularProgress
} from "@material-ui/core";
import firebase from "firebase/app";
import "@firebase/firestore";
import { useHistory } from "react-router-dom";

import FirebaseApp from "../../Firebase";
import { useDebounce } from "../../helpers/Debounce";
import { AuthContext } from "../../components/auth/Auth";
import { checkIfRoomExists } from "../room/DbRoom";
import { simpleStringOnly } from "../../helpers/StringHelpers";

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
  const [input, setInput] = useState("");
  const [state, setState] = useState({
    loading: false,
    error: "",
    exists: false
  });
  const { loading, error, exists } = state;
  const debouncedRoomName = useDebounce(input, 300);

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
    history.push(`/room/${debouncedRoomName}`);
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
          showVotes: false,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          lastVoteTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
          history: [
            {
              action: `${currentUser.displayName} has created room ${debouncedRoomName}`,
              timestamp: new Date().toISOString()
            }
          ],
          leaderOnly: false
        });
      history.push(`/room/${debouncedRoomName}`);
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        error: error.message
      });
    }
  };

  const isAwaitingValidInput =
    input !== debouncedRoomName ||
    debouncedRoomName.length < 4 ||
    loading ||
    error;
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
            helperText={"Some character restrictions apply"}
            fullWidth
            inputProps={{ style: { textAlign: "center" } }}
            value={input}
            onChange={e => setInput(simpleStringOnly(e.target.value))}
            InputProps={{
              endAdornment: (
                <InputAdornment position={"end"}>
                  {loading ? <CircularProgress /> : ""}
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant={"contained"}
            color={isAwaitingValidInput || !exists ? "inherit" : "primary"}
            fullWidth
            disabled={isAwaitingValidInput || !exists}
            onClick={joinRoom}
          >
            Join
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant={"contained"}
            color={isAwaitingValidInput || exists ? "inherit" : "primary"}
            fullWidth
            disabled={isAwaitingValidInput || exists}
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
