import React from "react";
import PropTypes from "prop-types";
import { Button, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const BUTTON_VALUES = [1, 2, 3, 5, 8, 13, 20, "?", "-"];

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    padding: spacing(3)
  }
}));

const ButtonGrid = ({ handleVote }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        {BUTTON_VALUES.map((value, idx) => (
          <Grid item md={3} sm={4} xs={6} key={`${idx}-vote-button`}>
            <Button
              variant={"contained"}
              onClick={() => handleVote(value)}
              fullWidth
            >
              {value}
            </Button>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

ButtonGrid.propTypes = {
  handleVote: PropTypes.func
};

export default ButtonGrid;
