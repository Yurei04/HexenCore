"use client";

import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative flex flex-col gap-1.5 items-center px-3 py-2 rounded-lg border border-pink-500/40 bg-gradient-to-b from-[#1a002c]/80 via-[#2a0049]/80 to-[#1a002c]/80 shadow-[0_0_15px_rgba(236,72,153,0.4)] backdrop-blur-sm"
    >
      {/* Animated top glow bar */}
      <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 animate-[pulse_2.5s_infinite]" />

      <p className="text-[10px] font-mono text-purple-300 tracking-wider mb-1">
        SYSTEM CONTROLS
      </p>

      {/* Buttons */}
      {[
        { label: "Night", mode: "sleepy", msg: " Entering Low-Power Mode..." },
        {
          label: "Color Blind",
          mode: "colorblind",
          msg: " Entering Color Blind Mode...",
        },
        { label: "Reset", mode: "default", msg: " Returning to Normal Mode..." },
      ].map(({ label, mode: newMode, msg }) => (
        <motion.div
          key={label}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
        >
          <Button
            onClick={() => handleModeChange(newMode, msg)}
            disabled={isDisabled}
            className={`w-24 text-[10px] font-semibold tracking-wider rounded-md px-1 py-1 border transition-all
              ${
                isDisabled
                  ? "opacity-40 cursor-not-allowed border-purple-600/40 text-purple-400"
                  : "cursor-pointer border-purple-500/60 hover:border-pink-400 hover:shadow-[0_0_10px_#ec4899]"
              }
              bg-transparent text-purple-200 hover:text-pink-200 hover:bg-purple-700/20
              focus:outline-none focus:ring-1 focus:ring-pink-400/50`}
          >
            {label}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
}
