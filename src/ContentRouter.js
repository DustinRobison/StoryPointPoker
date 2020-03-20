import React from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import loadable from "@loadable/component";

const Home = loadable(() => import("./pages/home/Home"));
const Session = loadable(() => import("./pages/session/Session"));

const ContentRouter = () => {
  const location = useLocation();
  return (
    <Switch location={location}>
      {/*  PUBLIC ROUTES */}
      <Route path={"/session/:id"} component={Session} />
      <Route path={"/"} component={Home} />
    </Switch>
  );
};

export default ContentRouter;
