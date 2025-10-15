"use client";

export default function ComputerControls({
  setMode,
  typeText,
  setHasStarted,
  setEyeSight,
  setColorblind,
  setMusic
}) {
  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <button
        onClick={() => {
          setMode("sleepy");
          typeText(" Entering Low-Power Mode...");
          setHasStarted(false);
          setEyeSight(true);
        }}
        className="text-xs border border-purple-500 px-2 py-1 rounded hover:bg-purple-600/40"
      >
        Sleep
      </button>

      <button
        onClick={() => {
          setMode("colorblind");
          typeText(" Entering Color Blind Mode...");
          setHasStarted(false);
          setColorblind(true);
        }}
        className="text-xs border border-purple-500 px-2 py-1 rounded hover:bg-purple-600/40"
      >
        Color Blind
      </button>

      <button
        onClick={() => {
          setMode("noMusic");
          typeText(" Music Shutting Down...");
          setHasStarted(false);
          setMusic(true);
        }}
        className="text-xs border border-purple-500 px-2 py-1 rounded hover:bg-purple-600/40"
      >
        No Music
      </button>

      <button
        onClick={() => {
          setMode("eyeSight");
          typeText(" Entering Larger Font Mode...");
          setHasStarted(false);
          setEyeSight(true);
        }}
        className="text-xs border border-purple-500 px-2 py-1 rounded hover:bg-purple-600/40"
      >
        EyeSight
      </button>
    </div>
  );
}
