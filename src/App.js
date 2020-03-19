import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import "typeface-roboto";

import { InitialState, StoreProvider } from "./store/Store";
import Theme from "./styles/Theme";
import { Reducer } from "./store/Reducers";
import ContentRouter from "./ContentRouter";

const useStyles = makeStyles({
  root: {}
});

function App() {
  const classes = useStyles();

  useEffect(() => {
    console.log(
      `${process.env.REACT_APP_DOMAIN} version: '${process.env.REACT_APP_VERSION}'`
    );
  }, []);

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <StoreProvider initialState={InitialState} reducer={Reducer}>
        <Router>
          <div className={classes.root}>
            <ContentRouter />
          </div>
        </Router>
      </StoreProvider>
    </ThemeProvider>
  );
}

export default App;
