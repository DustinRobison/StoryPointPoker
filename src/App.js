import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import "typeface-roboto";
import ReactGA from "react-ga";

import Theme from "./styles/Theme";
import ContentRouter from "./ContentRouter";
import SpAppBar from "./components/appBar/SpAppBar";
import ScrollToTop from "./components/scroll/SpScrollToTop";
import SpFooter from "./components/footer/SpFooter";
import { getFirebase } from "./Firebase";

ReactGA.initialize("G-Y7TZMB6YT7");
ReactGA.pageview(window.location.pathname + window.location.search);

export const FirebaseContext = React.createContext({});

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
  const [firebaseApp, setFirebaseApp] = useState(firebaseApp);

  useEffect(() => {
    console.log(
      `${process.env.REACT_APP_DOMAIN} version: '${process.env.REACT_APP_VERSION}'`
    );

    // Firebase connection
    const lazyApp = import("firebase/app");
    const lazyAuth = import("firebase/auth");
    const lazyFirestore = import("firebase/firestore");
    const lazyAnalytics = import("firebase/analytics");
    Promise.all([lazyApp, lazyAuth, lazyFirestore, lazyAnalytics]).then(
      ([firebase]) => {
        const firebaseInstance = getFirebase(firebase);
        firebaseInstance
          .auth()
          .signInAnonymously()
          .then(user => {
            console.log(`User: ${user.uid} successfully created`);
          })
          .catch(error => {
            console.log(`Firebase signInAnonymously error!`);
            console.log(error);
          });
        firebaseInstance.analytics();
        setFirebaseApp(firebaseInstance);
      }
    );
  }, []);

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <FirebaseContext.Provider value={firebaseApp}>
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
      </FirebaseContext.Provider>
    </ThemeProvider>
  );
};

export default App;
