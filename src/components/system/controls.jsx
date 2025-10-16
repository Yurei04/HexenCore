"use client";

import { Button } from "../ui/button";

export default function ComputerControls({
  typeText,
  setHasStarted,
  hasStarted,
  mode,
  setMode,
  isIntro,
}) {
  const isDisabled = hasStarted || isIntro;

  const handleModeChange = (newMode, message) => {
    if (isDisabled) return; 

    setMode(newMode);
    typeText(message);
    setHasStarted(false);

  };
  

  return (
    <div className="flex flex-col gap-1 items-center-safe">
      <Button
        onClick={() => handleModeChange("sleepy", "Entering Low-Power Mode...")}
        disabled={isDisabled}
        className={`text-xs border border-purple-500 px-2 py-1 rounded hover:bg-purple-600/40 transition ${
          isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        Sleep
      </Button>

      <Button
        onClick={() =>
          handleModeChange("colorblind", "Entering Color Blind Mode...")
        }
        disabled={isDisabled}
        className={`text-xs border border-purple-500 px-2 py-1 rounded hover:bg-purple-600/40 transition ${
          isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        Color Blind
      </Button>

      <Button
        onClick={() =>
          handleModeChange("default", "Returning to Normal Mode...")
        }
        disabled={isDisabled}
        className={`text-xs border border-purple-500 px-2 py-1 rounded hover:bg-purple-600/40 transition ${
          isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        Reset
      </Button>
    </div>
  );
}
