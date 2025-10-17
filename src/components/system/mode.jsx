"use client";

import { motion } from "framer-motion";

export default function ComputerMode({ mode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden flex items-center text-center relative px-4 py-2 w-11/12 rounded-lg border border-purple-500/40 bg-gradient-to-r from-[#1a002c]/80 via-[#2a0049]/80 to-[#1a002c]/80 shadow-[0_0_15px_rgba(168,85,247,0.4)] backdrop-blur-sm"
    >
      {/* Techy pulse light bar */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-pink-500 via-purple-400 to-pink-500 animate-[pulse_2.5s_infinite]" />

      <p className="text-sm font-mono tracking-widest text-pink-200">
        Mode:{" "}
        <span className="text-[10px] text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 font-semibold drop-shadow-[0_0_6px_#ec4899]">
          {mode}
        </span>
      </p>
    </motion.div>
  );
}
