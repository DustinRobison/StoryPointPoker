import React from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import loadable from "@loadable/component";

const Home = loadable(() => import("./pages/home/Home"));
const Room = loadable(() => import("./pages/room/Room"));

const ContentRouter = () => {
  const location = useLocation();
  return (
    <Switch location={location}>
      {/*  PUBLIC ROUTES */}
      <Route path={"/room/:id"} component={Room} />
      <Route path={"/"} component={Home} />
    </Switch>
  );
};

export default ContentRouter;
