"use client";

import { createContext, useContext, useState } from "react";

const ModeContext = createContext();

export function ModeProvider({ children }) {
  const [sleep, setSleep] = useState(false);
  const [colorblind, setColorblind] = useState(false);
  const [music, setMusic] = useState(true);
  const [eyeSight, setEyeSight] = useState(false);

  const toggleSleep = () => setSleep((prev) => !prev);
  const toggleColorblind = () => setColorblind((prev) => !prev);
  const toggleMusic = () => setMusic((prev) => !prev);
  const toggleEyeSight = () => setEyeSight((prev) => !prev);

  return (
    <ModeContext.Provider
      value={{
        sleep,
        colorblind,
        music,
        eyeSight,
        toggleSleep,
        toggleColorblind,
        toggleMusic,
        toggleEyeSight,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
}

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context)
    throw new Error("useMode must be used within a ModeProvider");
  return context;
};