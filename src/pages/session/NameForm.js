import React, { useContext, useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Paper, Grid, Typography, TextField, Button } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";

import { AuthContext } from "../../components/auth/Auth";

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    padding: spacing(3)
  },
  formContainer: {
    padding: spacing(3),
    [breakpoints.up("md")]: {
      width: "20rem",
      marginLeft: "auto",
      marginRight: "auto"
    }
  }
}));

const NameForm = () => {
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();
  const location = useLocation();

  const setDisplayName = async () => {
    if (!name) {
      setError("You Must enter a name");
      return;
    }
    await currentUser.updateProfile({
      displayName: name
    });

    // little hack to force a refresh
    history.push(location.pathname);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.formContainer}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography>Please Enter your name:</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={"Name"}
              value={name}
              onChange={e => setName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant={"contained"} fullWidth onClick={setDisplayName}>
              Submit
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography color={"error"} align={"center"}>
              {error}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default NameForm;
