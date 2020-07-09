import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import "typeface-roboto";
import ReactGA from 'react-ga';

import { InitialState, StoreProvider } from "./store/Store";
import Theme from "./styles/Theme";
import { Reducer } from "./store/Reducers";
import ContentRouter from "./ContentRouter";
import SpAppBar from "./components/appBar/SpAppBar";
import ScrollToTop from "./components/scroll/SpScrollToTop";
import SpFooter from "./components/footer/SpFooter";
import { AuthProvider } from "./components/auth/Auth";
import FirebaseApp from "./Firebase";

ReactGA.initialize("G-Y7TZMB6YT7");
ReactGA.pageview(window.location.pathname + window.location.search);

const APP_BAR_HEIGHT = 80;

const useStyles = makeStyles({
  contentContainer: {
    flex: "1 0 auto"
  },
  appBarSpacer: {
    height: APP_BAR_HEIGHT
  },
  appFooter: {
    flexShrink: 0
  }
});

const App = () => {
  const classes = useStyles();

  useEffect(() => {
    console.log(
      `${process.env.REACT_APP_DOMAIN} version: '${process.env.REACT_APP_VERSION}'`
    );
    FirebaseApp.auth().signInAnonymously();
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <StoreProvider initialState={InitialState} reducer={Reducer}>
          <Router>
            <ScrollToTop />
            <div className={classes.contentContainer}>
              <nav className={classes.appBarSpacer}>
                <SpAppBar height={APP_BAR_HEIGHT} />
              </nav>
              <ContentRouter />
            </div>
            <footer className={classes.appFooter}>
              <SpFooter />
            </footer>
          </Router>
        </StoreProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
