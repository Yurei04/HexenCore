"use client";

export default function ComputerControls({ typeText, setHasStarted, setMode }) {
  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <button
        onClick={() => {
          setMode("sleepy");
          typeText(" Entering Low-Power Mode...");
          setHasStarted(false);
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
          setTimeout(() => {
            setMode("idle");
            typeText("System ready. Press Start to begin test.");
          }, 3000);
        }}
        
        className="text-xs border border-purple-500 px-2 py-1 rounded hover:bg-purple-600/40"
      >
        Color Blind
      </button>

      <button
        onClick={() => {
          setMode("default");
          typeText(" Returning to Normal Mode...");
          setHasStarted(true);
          setTimeout(() => {
            setMode("idle");
            typeText("System ready. Press Start to begin test.");
          }, 3000);
        }}
        className="text-xs border border-purple-500 px-2 py-1 rounded hover:bg-purple-600/40"
      >
        Reset
      </button>
    </div>
  );
}
