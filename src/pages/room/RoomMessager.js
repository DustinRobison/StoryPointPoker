import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  IconButton,
  InputAdornment,
  List,
  ListItem,
  Paper,
  TextField
} from "@material-ui/core";
import { Send } from "@material-ui/icons";

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    padding: spacing(3)
  }
}));

const RoomMessager = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <List className={classes.messageContainer}>
        {messages.map(({ text, timestamp }, idx) => (
          <ListItem key={`${idx}-message`} component={Paper}>
            {text}
          </ListItem>
        ))}
      </List>
      <form onSubmit={handleMessageSubmit} noValidate autoComplete="off">
        <TextField
          label={"Send a message"}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton type={"submit"}>
                  <Send />
                </IconButton>
              </InputAdornment>
            )
          }}
          value={state.message}
          onChange={e =>
            setState({
              ...state,
              message: e.target.value
            })
          }
        />
      </form>
    </div>
  );
};

export default RoomMessager;
