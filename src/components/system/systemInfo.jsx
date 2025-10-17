"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function SystemInfo({
  hasStarted,
  currentQuestionIndex,
  questions,
}) {
  const text = hasStarted
    ? `Question ${currentQuestionIndex + 1}/${questions.length}`
    : "System Ready";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative flex flex-col items-center justify-center px-4 py-2 rounded-lg border border-pink-500/40 bg-gradient-to-b from-[#1a002c]/80 via-[#2a0049]/80 to-[#1a002c]/80 shadow-[0_0_15px_rgba(236,72,153,0.4)] backdrop-blur-sm text-center"
    >
      {/* Top glow bar */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 animate-[pulse_2.5s_infinite]" />

      {/* Animated system text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={text}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.35 }}
          className={`text-sm font-mono tracking-widest ${
            hasStarted
              ? "text-pink-300 drop-shadow-[0_0_6px_#ec4899]"
              : "text-purple-300 drop-shadow-[0_0_6px_#a855f7]"
          }`}
        >
          {text}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}
