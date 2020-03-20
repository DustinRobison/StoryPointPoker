import React from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction
} from "@material-ui/core";
import { Timer, CheckCircle } from "@material-ui/icons";

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    padding: spacing(3)
  },
  listItem: {
    borderBottom: "1px solid black"
  }
}));

const Results = ({ showVotes }) => {
  const classes = useStyles();
  const users = [
    { name: "Dustin", vote: 3 },
    { name: "greg", vote: null }
  ];
  return (
    <div className={classes.root}>
      <Typography variant={"h6"}>Results</Typography>
      <List>
        {users.map(({ name, vote }, idx) => (
          <ListItem key={`${idx}-user`} className={classes.listItem}>
            <ListItemIcon>
              {vote === null ? <Timer /> : <CheckCircle color={"action"} />}
            </ListItemIcon>
            <ListItemText primary={name} />
            <ListItemSecondaryAction>
              {showVotes ? (
                <Typography variant={"h6"}>{vote}</Typography>
              ) : null}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

Results.propTypes = {
  showVotes: PropTypes.bool.isRequired
};

export default Results;
