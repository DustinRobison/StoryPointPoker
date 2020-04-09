import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { IconButton, InputAdornment, TextField } from "@material-ui/core";
import { Send } from "@material-ui/icons";
import { isString } from "lodash";

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    padding: spacing(1)
  }
}));

const MessageInput = ({ label, readOnly, parentMessage, submitMessage }) => {
  const classes = useStyles();

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isString(parentMessage)) {
      setMessage(parentMessage);
    }
  }, [parentMessage]);

  const handleMessageSubmit = e => {
    e.preventDefault();
    if (message !== parentMessage) {
      submitMessage(message);
    }
  };

  return (
    <div className={classes.root}>
      <form onSubmit={handleMessageSubmit} noValidate autoComplete="off">
        <TextField
          label={label}
          fullWidth
          InputProps={{
            endAdornment: readOnly ? (
              undefined
            ) : (
              <InputAdornment position="end">
                <IconButton type={"submit"}>
                  <Send />
                </IconButton>
              </InputAdornment>
            ),
            readOnly
          }}
          value={message}
          onChange={e => setMessage(e.target.value)}
          helperText={message !== parentMessage ? "Not Sent Yet" : ""}
        />
      </form>
    </div>
  );
};

MessageInput.propTypes = {
  label: PropTypes.string,
  readOnly: PropTypes.bool,
  parentMessage: PropTypes.string,
  submitMessage: PropTypes.func
};

export default MessageInput;
