import React, { useState } from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  TextField
} from "@material-ui/core";
import {
  Timer,
  CheckCircle,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon
} from "@material-ui/icons";

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    padding: spacing(3)
  }
}));

const Results = ({ showVotes, users, removeUser, isOwner, updateUserName }) => {
  const classes = useStyles();
  const [state, setState] = useState({
    isEditingName: false,
    name: ""
  });
  const { isEditingName } = state;
  return (
    <div className={classes.root}>
      <Typography variant={"h6"}>Results</Typography>
      <List>
        {Array.isArray(users)
          ? users.map(({ name, vote, active, uid, isCurrentUser }, idx) => (
              <ListItem key={`${idx}-user`} className={classes.listItem}>
                <ListItemIcon>
                  {isCurrentUser || showVotes ? (
                    <Typography
                      variant={showVotes ? "h5" : "subtitle1"}
                      color={showVotes ? "textPrimary" : "inherit"}
                    >
                      {vote}
                    </Typography>
                  ) : vote === "" || vote === "-" ? (
                    <Timer />
                  ) : (
                    <CheckCircle color={"action"} />
                  )}
                </ListItemIcon>
                <TextField
                  InputProps={{
                    readOnly: !isCurrentUser && !isEditingName
                  }}
                  value={isCurrentUser && isEditingName ? state.name : name}
                  onChange={e => setState({ ...state, name: e.target.value })}
                />
                <ListItemSecondaryAction>
                  {isCurrentUser ? (
                    isEditingName ? (
                      <IconButton
                        edge={"end"}
                        aria-label={"Save"}
                        onClick={() =>
                          updateUserName(state.name)
                            .then(res =>
                              setState({
                                ...state,
                                isEditingName: false
                              })
                            )
                            .catch(err => {})
                        }
                      >
                        <SaveIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        edge={"end"}
                        aria-label={"Edit Name"}
                        onClick={() =>
                          setState({
                            ...state,
                            name,
                            isEditingName: true
                          })
                        }
                      >
                        <EditIcon />
                      </IconButton>
                    )
                  ) : isOwner ? (
                    <IconButton
                      edge={"end"}
                      aria-label={"Remove User"}
                      onClick={() => removeUser(uid)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  ) : null}
                </ListItemSecondaryAction>
              </ListItem>
            ))
          : null}
      </List>
    </div>
  );
};

Results.propTypes = {
  isOwner: PropTypes.bool,
  showVotes: PropTypes.bool.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      vote: PropTypes.string,
      isCurrentUser: PropTypes.bool
    })
  ),
  removeUser: PropTypes.func.isRequired,
  updateUserName: PropTypes.func.isRequired
};

export default Results;
