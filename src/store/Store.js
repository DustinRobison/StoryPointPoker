import React, { createContext, useContext, useReducer } from "react";

export const InitialState = {
  user: {}
};

export const StoreContext = createContext(InitialState);

export const StoreProvider = ({ reducer, initialState, children }) => (
  <StoreContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StoreContext.Provider>
);

export const useStore = () => useContext(StoreContext);
