// src/components/system/ComputerControls.jsx
"use client";
import { useMode } from "./modeContext";

export default function ComputerControls({ typeText, setHasStarted, setMode }) {
  const {
    toggleSleep,
    toggleColorblind,
    toggleMusic,
    toggleEyeSight,
  } = useMode();

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <button
        onClick={() => {
          toggleSleep();
          setMode("sleepy");
          typeText("Entering Low-Power Mode...");
          setHasStarted(false);
        }}
        className="text-xs border border-purple-500 px-2 py-1 rounded hover:bg-purple-600/40"
      >
        Sleep
      </button>

      <button
        onClick={() => {
          toggleColorblind();
          setMode("colorblind");
          typeText("Entering Color Blind Mode...");
          setHasStarted(false);
        }}
        className="text-xs border border-purple-500 px-2 py-1 rounded hover:bg-purple-600/40"
      >
        Color Blind
      </button>

      <button
        onClick={() => {
          toggleMusic();
          setMode("noMusic");
          typeText("Music Shutting Down...");
          setHasStarted(false);
        }}
        className="text-xs border border-purple-500 px-2 py-1 rounded hover:bg-purple-600/40"
      >
        No Music
      </button>

      <button
        onClick={() => {
          toggleEyeSight();
          setMode("eyeSight");
          typeText("Entering Larger Font Mode...");
          setHasStarted(false);
        }}
        className="text-xs border border-purple-500 px-2 py-1 rounded hover:bg-purple-600/40"
      >
        EyeSight
      </button>
    </div>
  );
}
