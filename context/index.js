"use client";

import { createContext, useState } from "react";

export const Context = createContext(undefined);

export const ContextProvider = ({ children }) => {
  const [countOnCreateNewCoach, setCountOnCreateNewCoach] = useState(1);

  return (
    <Context.Provider
      value={{ countOnCreateNewCoach, setCountOnCreateNewCoach }}
    >
      {children}
    </Context.Provider>
  );
};
