"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TimeAndDate() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative px-4 py-2 rounded-lg border border-pink-500/40 bg-gradient-to-r from-[#1a002c]/80 via-[#2a0049]/80 to-[#1a002c]/80 shadow-[0_0_20px_rgba(236,72,153,0.4)] backdrop-blur-sm text-center select-none"
    >
      {/* Glow Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 animate-[pulse_2.5s_infinite]" />

      {/* Date */}
      <p className="text-xs font-mono text-purple-300 tracking-widest drop-shadow-[0_0_6px_#a855f7]">
        {time.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>

      {/* Time */}
      <motion.p
        key={time.toLocaleTimeString()}
        initial={{ opacity: 0.6, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 drop-shadow-[0_0_10px_#ec4899]"
      >
        {time.toLocaleTimeString()}
      </motion.p>
    </motion.div>
  );
}
