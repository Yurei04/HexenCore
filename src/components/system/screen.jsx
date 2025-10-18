"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ComputerScreen({
  getFaceSrc,
  staticOn,
  displayText,
  isTyping,
  mode,
  hasStarted,
  handleStart,
  currentQuestion,
  handleAnswer,
  selectedAnswer,
  messages,
  chatStarted
}) {
  return (
    <div className="flex flex-col items-center text-center w-full h-full relative bg-gradient-to-b from-[#0a0013] via-[#140025] to-[#1b0036] p-4 rounded-2xl shadow-[0_0_25px_#a855f7] border border-pink-500/30 overflow-hidden">
      {/* Techy glow grid background */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.3)_0,transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(168,85,247,0.2)_1px,transparent_1px),linear-gradient(-45deg,rgba(236,72,153,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {chatStarted ? (
        // 💬 Chat Mode
        <div className="flex flex-col justify-end w-full h-full overflow-y-auto text-left space-y-2 z-10">
          <div className="flex flex-col-reverse overflow-y-auto h-full scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-transparent px-2">
            {[...messages].reverse().map((msg, idx) => (
              <div
                key={idx}
                className={`my-1 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                    msg.sender === "user"
                      ? "bg-pink-700/30 border border-pink-400/30 text-pink-200"
                      : "bg-purple-800/30 border border-purple-400/30 text-purple-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* 🤖 AI Face */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative w-[220px] h-[220px] mb-3 z-10"
          >
            <Image
              src={getFaceSrc()}
              alt="AI Face"
              fill
              className={`object-contain transition-all duration-300 drop-shadow-[0_0_20px_#ec4899] ${
                staticOn ? "opacity-100" : "opacity-80"
              }`}
              priority
            />
          </motion.div>

          {/* 📝 Typewriter Dialogue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-pink-300 text-sm font-mono min-h-[50px] max-w-[90%] leading-relaxed tracking-wide z-10"
          >
            <span className="drop-shadow-[0_0_6px_#f472b6]">{displayText}</span>
            {isTyping && <span className="animate-pulse text-purple-400 ml-1">▌</span>}
          </motion.div>

          {/* ❓ Question Section */}
          {hasStarted && currentQuestion && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.question}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.45 }}
                className="flex flex-col items-center justify-center mt-3 w-full max-w-[90%] z-10"
              >
                <h3 className="text-lg font-semibold text-purple-300 mb-3 tracking-tight drop-shadow-[0_0_10px_#a855f7]">
                  {currentQuestion.question}
                </h3>

                {/* Multiple Choice */}
                {currentQuestion.type === "multiple" && (
                  <div className="grid grid-cols-2 gap-3 w-full max-w-[85%] mx-auto">
                    {currentQuestion.options.map((opt, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => handleAnswer(opt)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg border transition-all text-sm font-semibold tracking-wide shadow-[0_0_10px_rgba(236,72,153,0.4)]
                          ${
                            selectedAnswer === opt
                              ? "bg-gradient-to-r from-pink-600 to-purple-700 text-white border-pink-400 shadow-[0_0_20px_#ec4899]"
                              : "bg-transparent border-purple-500/40 hover:bg-purple-600/20 text-purple-200"
                          }`}
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* True/False */}
                {currentQuestion.type === "torf" && (
                  <div className="flex gap-4 mt-3">
                    {["TRUE", "FALSE"].map((opt) => (
                      <motion.button
                        key={opt}
                        onClick={() => handleAnswer(opt)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-5 py-2 rounded-lg border transition-all text-sm font-semibold tracking-wide
                          ${
                            selectedAnswer === opt
                              ? "bg-gradient-to-r from-pink-600 to-purple-700 text-white border-pink-400 shadow-[0_0_20px_#ec4899]"
                              : "bg-transparent border-purple-500/40 hover:bg-purple-600/20 text-purple-200"
                          }`}
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Yes/No */}
                {currentQuestion.type === "yesno" && (
                  <div className="flex gap-4 mt-3">
                    {["YES", "NO"].map((opt) => (
                      <motion.button
                        key={opt}
                        onClick={() => handleAnswer(opt)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-5 py-2 rounded-lg border transition-all text-sm font-semibold tracking-wide
                          ${
                            selectedAnswer === opt
                              ? "bg-gradient-to-r from-pink-600 to-purple-700 text-white border-pink-400 shadow-[0_0_20px_#ec4899]"
                              : "bg-transparent border-purple-500/40 hover:bg-purple-600/20 text-purple-200"
                          }`}
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </>
      )}
    </div>
  );

}
