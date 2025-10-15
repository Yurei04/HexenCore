"use client";
import ComputerControls from "@/components/system/controls";
import ComputerMode from "@/components/system/mode";
import { ModeProvider } from "@/components/system/modeContext";
import ComputerScreen from "@/components/system/screen";
import SystemInfo from "@/components/system/systemInfo";
import TimeAndDate from "@/components/system/time";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [mode, setMode] = useState("booting");
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [staticOn, setStaticOn] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [correctAnswers, setCorrectedAnswers] = useState(0)
  const [results, setResults] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [answerTimes, setAnswerTimes] = useState([]);
  const [evaluation, setEvaluation] = useState([]);
  const [sleep, setSleep] = useState(false);
  const [eyeSight, setEyesSight] = useState(false);
  const [music, setMusic] = useState(false);
  const [colorblind, setColorblind] = useState(false);

  const dialogues = {
    intro: [
      " Initializing neural link...",
      " Running diagnostics... All systems stable.",
      " Hello, I am Core — your AI evaluator assistant.",
      " When you’re ready, we can begin.",
    ],

    closing: [
      " System Shutting Down...",
      " Thank you and have a good day:)"
    ]
  };

  const questions = [
    {
      type: "multiple",
      question: "What is the capital of France?",
      options: ["Paris", "London", "Rome", "Berlin"],
      answer: "Paris",
    },
    {
      type: "torf",
      question: "The sun rises in the west.",
      answer: "FALSE",
    },
    {
      type: "yesno",
      question: "Do you like AI?",
      answer: "YES",
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const typeText = (text, onComplete) => {
    setIsTyping(true);
    setDisplayText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
        if (onComplete) onComplete();
      }
    }, 40);
  };

  useEffect(() => {
    if (hasStarted && mode.includes("questioning")) {
      setStartTime(Date.now());
    }
  }, [currentQuestionIndex, hasStarted, mode]);

  useEffect(() => {
    const flicker = setInterval(() => {
      setStaticOn((prev) => !prev);
    }, 200); 
    return () => clearInterval(flicker);
  }, []);

  useEffect(() => {
  if (mode === "booting") {
    let i = 0;
    const runIntro = () => {
      if (i < dialogues.intro.length) {
        typeText(dialogues.intro[i], () => {
          i++;
          setTimeout(runIntro, 1000);
        });
      } else {
        setMode("idle");
      }
    };
      runIntro();
    }
  }, [mode, dialogues.intro]);


  useEffect(() => {
    if (!currentQuestion) return;
    if (currentQuestion.type === "multiple") setMode("questioningMultiple");
    else if (currentQuestion.type === "torf") setMode("questioningTorF");
    else if (currentQuestion.type === "yesno") setMode("questioningNormal");
  }, [currentQuestionIndex]);

  const handleStart = () => {
    setHasStarted(true);
    setMode("talking");
    typeText(" Let's begin your assessment...");
    setTimeout(() => {
      setMode("questioningMultiple");
    }, 2000);
  };

  const sleepStart = () => {
    setSleep(true);
  // Optional: logic when sleep mode activates
  };

  const colorblindStart = () => {
    setColorblind(true);
    // Optional: logic when colorblind mode activates
  };

  const noMusicStart = () => {
    setMusic(true);
    // Optional: logic to mute background music
  };

  const eyeSightStart = () => {
    setEyesSight(true);
    // Optional: logic to increase font size
  };

  const handleAnswer = (answer) => {
    const endTime = Date.now();
    if (startTime) {
      const timeTaken = (endTime - startTime) / 1000; 
      setAnswerTimes((prev) => [...prev, timeTaken]);
    }

    setSelectedAnswer(answer);

    if (answer === currentQuestion.answer) {
      setCorrectedAnswers((prev) => prev + 1);
    }

    setMode("talking");
    typeText(" Processing your response...");

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        // compute average time
        const totalTime = answerTimes.reduce((a, b) => a + b, 0);
        const averageTime = totalTime / answerTimes.length;

        typeText(` Assessment complete. Well done! 
        Average time per question: ${averageTime.toFixed(2)}s`);

        setMode("idle");
        setCurrentQuestionIndex(0);
        setCorrectedAnswers(0);
        setHasStarted(false);
        setAnswerTimes([]); 
      }
    }, 2000);
  };

  const getFaceSrc = () => {
    switch (mode) {
      case "sleepy":
        return "/images/sleeping.png";
      case "talking":
        return "/images/idle-face.png";
      case "questioningMultiple":
      case "questioningTorF":
      case "questioningNormal":
        return "/images/checking.png";
      default:
        return "/images/idle-face.png";
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden ">
      {/* Frame */}
      <Image
        src="/images/screenMain1NoBkg.png"
        alt="Main Computer Interface"
        fill
        className="object-contain z-20 pointer-events-none"
        priority
      />

      {/* --- MAIN SCREEN --- */}
      <div className="absolute w-[25%] h-[40%] top-[16%] left-[37%] z-10 bg-black/80 rounded-sm text-center flex flex-col items-center justify-center p-4  overflow-hidden">
        <ComputerScreen
          getFaceSrc={getFaceSrc}
          staticOn={staticOn}
          displayText={displayText}
          isTyping={isTyping}
          mode={mode}
          hasStarted={hasStarted}
          handleStart={handleStart}
          currentQuestion={currentQuestion}
          handleAnswer={handleAnswer}
          selectedAnswer={selectedAnswer}
        />
      </div>

      {/* --- TOP LEFT (DATE/TIME) --- */}
      <div className="absolute w-[17%] h-[22%] top-[12%] left-[16%] bg-black/70 rounded-sm flex flex-col items-center justify-center text-white text-xs">
        <TimeAndDate />
      </div>

      {/* --- BOTTOM LEFT (CONTROL) --- */}
      <div className="absolute w-[12%] h-[20%] top-[45%] left-[18%] bg-black/70 rounded-sm text-white">
        <ModeProvider>
            <ComputerControls
              setMode={setMode}
              typeText={typeText}
              setHasStarted={setHasStarted}
            />
        </ModeProvider>
      </div>

      {/* --- TOP RIGHT (MODE STATUS) --- */}
      <div className="absolute w-[13%] h-[20%] top-[15%] right-[18%] bg-black/70 rounded-sm flex items-center justify-center text-white text-xs">
        <ComputerMode mode={mode}/>
      </div>

      {/* --- BOTTOM RIGHT (SYSTEM INFO) --- */}
      <div className="absolute w-[12%] h-[20%] top-[43%] right-[18%] bg-black/70 rounded-sm flex items-center justify-center text-white text-xs">
        <SystemInfo
          hasStarted={hasStarted}
          currentQuestionIndex={currentQuestionIndex}
          questions={questions}
        />
      </div>
    </div>
  );
}
