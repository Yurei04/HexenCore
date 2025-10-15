"use client";

import Image from "next/image";

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
}) {
  return (
    <div className="flex flex-col items-center text-center space-y-4 w-full h-full">
      {/* Face */}
      <div className="relative w-[250px] h-[250px]">
        <Image
          src={getFaceSrc()}
          alt="AI Face"
          fill
          className={`object-contain transition-opacity duration-150 ${
            staticOn ? "opacity-100" : "opacity-80"
          }`}
          priority
        />
      </div>

      {/* Dialogue */}
      <div className="text-purple-300 text-sm font-mono min-h-[60px]">
        {displayText}
        {isTyping && <span className="animate-pulse">▌</span>}
      </div>

      {/* Start button */}
      {mode === "idle" && !isTyping && !hasStarted && (
        <button
          onClick={handleStart}
          className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Start Test
        </button>
      )}

      {/* Question UI */}
      {hasStarted && mode.includes("questioning") && currentQuestion && (
        <div className="flex flex-col items-center gap-3 text-white text-sm mt-4">
          <p className="text-lg font-semibold">{currentQuestion.question}</p>

          {/* Multiple Choice */}
          {mode === "questioningMultiple" &&
            currentQuestion.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                className={`px-4 py-2 border border-purple-400 rounded w-full hover:bg-purple-600/40 transition ${
                  selectedAnswer === opt ? "bg-purple-600/60" : ""
                }`}
              >
                {String.fromCharCode(65 + i)}. {opt}
              </button>
            ))}

          {/* True/False */}
          {mode === "questioningTorF" &&
            ["TRUE", "FALSE"].map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                className={`px-4 py-2 border border-purple-400 rounded w-full hover:bg-purple-600/40 transition ${
                  selectedAnswer === opt ? "bg-purple-600/60" : ""
                }`}
              >
                {opt}
              </button>
            ))}

          {/* Yes/No */}
          {mode === "questioningNormal" &&
            ["YES", "NO"].map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                className={`px-4 py-2 border border-purple-400 rounded w-full hover:bg-purple-600/40 transition ${
                  selectedAnswer === opt ? "bg-purple-600/60" : ""
                }`}
              >
                {opt}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
