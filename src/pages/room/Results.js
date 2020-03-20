import React from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
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

const Results = ({ showVotes, users }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant={"h6"}>Results</Typography>
      <List>
        {Array.isArray(users)
          ? users.map(({ name, vote, active, uid, isCurrentUser }, idx) => (
              <ListItem
                key={`${idx}-user`}
                className={classes.listItem}
                disabled={!active}
              >
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
                <ListItemText primary={name ? name : ""} />
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
      active: PropTypes.bool.isRequired,
      vote: PropTypes.string,
      isCurrentUser: PropTypes.bool
    })
  )
};

export default Results;
