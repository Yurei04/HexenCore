"use client";
import ComputerControls from "@/components/system/controls";
import ComputerMode from "@/components/system/mode";
import ComputerScreen from "@/components/system/screen";
import SystemInfo from "@/components/system/systemInfo";
import TimeAndDate from "@/components/system/time";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import questionsData from "@/../public/data/questions.json";
import DialogScreen from "@/components/system/hexSkill";
import { Input } from "@/components/ui/input";
import chatResponses from "@/../public/data/chatResponses.json";
import HexChat from "@/components/system/hexChat";

export default function Home() {
  const [mode, _setMode] = useState("booting");
  const [displayText, setDisplayText] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [staticOn, setStaticOn] = useState(true);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [correctAnswers, setCorrectedAnswers] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answerTimes, setAnswerTimes] = useState([]);
  const [startTime, setStartTime] = useState(null);

  const [allSubjects, setAllSubjects] = useState({});
  const [chosenSubjects, setChosenSubjects] = useState([]);
  const [showSkillTree, setShowSkillTree] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [isIntroPlaying, setIsIntroPlaying] = useState(true);

  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState([]);

  const [booting, setBooting] = React.useState(true);

  const fallbackSubjects = ["Math", "Science", "History", "Tech", "Art", "Language"];
  const subjectsFromData =
    allSubjects && Object.keys(allSubjects).length > 0 ? Object.keys(allSubjects) : fallbackSubjects;

  const dialogues = {
    intro: [
      " Initializing neural link...",
      " Running diagnostics... All systems stable.",
      " Hello, I am Core — your AI evaluator assistant.",
      " When you’re ready, we can begin.",
    ],
  };

  const setMode = (newMode) => {
    _setMode((prev) => {
      if (prev === "sleepy" && newMode !== "default") return prev;
      return newMode;
    });
  };

  const toggleChatMode = () => {
    if (testStarted) {
      alert(" You cannot activate the chatbot during test mode.");
      return;
    }
    setChatStarted((prev) => !prev);
  };

  const toggleTestMode = () => {
    if (chatStarted) {
      alert(" You cannot start the test while chatbot mode is active.");
      return;
    }
    setTestStarted((prev) => !prev);
  };

  const typeText = (text, modeArg = "message", onComplete) => {
    setIsTyping(true);
    if (modeArg === "question") setQuestionText("");
    else setDisplayText("");

    let i = 0;
    const speed = modeArg === "message" ? 28 : 30;
    const interval = setInterval(() => {
      if (modeArg === "question") {
        setQuestionText((prev) => prev + text.charAt(i));
      } else {
        setDisplayText((prev) => prev + text.charAt(i));
      }
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
        if (onComplete) onComplete();
      }
    }, speed);
  };

  useEffect(() => {
    let mounted = true;
    fetch("/data/questions.json")
      .then((res) => {
        if (!res.ok) throw new Error("Network response not ok");
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        if (data && data.subjects) setAllSubjects(data.subjects);
        else if (questionsData && questionsData.subjects) setAllSubjects(questionsData.subjects);
      })
      .catch(() => {
        if (questionsData && questionsData.subjects) setAllSubjects(questionsData.subjects);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const toggleSubject = (subject) => {
    setChosenSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : prev.length < 3 ? [...prev, subject] : prev
    );
  };

  const handleConfirmSubjects = () => {
    if (chosenSubjects.length < 1) {
      typeText(" Please select at least one subject.", "message");
      return;
    }

    const selectedQuestions = chosenSubjects.flatMap((subj) => {
      const subjectQs = allSubjects[subj] || [];
      const clone = [...subjectQs];
      return clone.sort(() => 0.5 - Math.random()).slice(0, 6);
    });

    if (!selectedQuestions.length) {
      typeText(" No questions found for the selected subjects.", "message");
      return;
    }

    setQuestions(selectedQuestions);
    setShowSkillTree(false);
    setTestStarted(true);
    setMode("talking");
    typeText(" Excellent choices. Preparing your custom assessment...", "message", () => {
      setCurrentQuestionIndex(0);
      setHasStarted(true);
    });
  };

  useEffect(() => {
    if (mode !== "booting") return;
    let i = 0;
    const runIntro = () => {
      if (i < dialogues.intro.length) {
        typeText(dialogues.intro[i], "message", () => {
          i++;
          setTimeout(runIntro, 700);
        });
      } else {
        setTimeout(() => {
          setIsIntroPlaying(false);
          typeText(" Access granted. Please select up to three skill modules to begin your assessment.", "message");
        }, 700);
      }
    };
    runIntro();
  }, [mode]);

  useEffect(() => {
    const flicker = setInterval(() => setStaticOn((p) => !p), 200);
    return () => clearInterval(flicker);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (!hasStarted || !currentQuestion) return;
    setDisplayText("");
    setQuestionText("");
    typeText(currentQuestion.question, "question", () => {
      if (currentQuestion.type === "multiple") setMode("questioningMultiple");
      else if (currentQuestion.type === "torf") setMode("questioningTorF");
      else if (currentQuestion.type === "yesno") setMode("questioningNormal");
      else setMode("questioningMultiple");
      setStartTime(Date.now());
    });
  }, [currentQuestionIndex, hasStarted, currentQuestion]);

  const handleStart = () => {
    if (questions.length === 0) {
      typeText(" No questions loaded yet.", "message");
      return;
    }
    setHasStarted(true);
    setCurrentQuestionIndex(0);
    setMode("talking");
    typeText(" Let's begin your assessment...", "message");
  };

  const handleAnswer = (answer) => {
    if (!currentQuestion) return;
    const endTime = Date.now();
    const timeTaken = startTime ? (endTime - startTime) / 1000 : 0;
    setAnswerTimes((prev) => [...prev, timeTaken]);
    setSelectedAnswer(answer);
    if (answer === currentQuestion.answer) {
      setCorrectedAnswers((prev) => prev + 1);
    }
    setMode("talking");
    typeText(" Processing your response...", "message", () => {
      setDisplayText("");
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        const snapshot = [...answerTimes, timeTaken];
        const totalTime = snapshot.reduce((a, b) => a + b, 0);
        const averageTime = snapshot.length ? totalTime / snapshot.length : 0;
        typeText(` Assessment complete. Well done! Average time per question: ${averageTime.toFixed(2)}s`, "message", () => {
          setMode("idle");
          setCurrentQuestionIndex(0);
          setCorrectedAnswers(0);
          setHasStarted(false);
          setAnswerTimes([]);
          setTestFinished(true);
          setTestStarted(false);
        });
      }
    });
  };

  const handleSendMessage = (msg) => {
    const lowerMsg = msg.toLowerCase().trim();
    const botReply = chatResponses[lowerMsg] || "I'm not sure how to respond to that yet.";
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: msg },
      { sender: "bot", text: botReply },
    ]);
  };

  const getFaceSrc = () => {
    switch (mode) {
      case "sleepy":
        return "/images/sleeping.png";
      case "ready":
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

  // Skeleton loader — only shows if network or assets take too long to load
  const [slowLoading, setSlowLoading] = useState(false);

  // detect slow internet or delayed loading
  useEffect(() => {
    const timer = setTimeout(() => {
      // if the page still hasn't finished loading after 2.5s, show skeleton
      if (document.readyState !== "complete") {
        setSlowLoading(true);
      }
    }, 2500);

    // once page fully loads, hide skeleton
    const handleLoad = () => {
      clearTimeout(timer);
      setSlowLoading(false);
    };
    window.addEventListener("load", handleLoad);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  if (slowLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-black text-purple-300">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-40 h-40 bg-purple-800/30 rounded-full mb-6" />
          <p className="text-lg font-mono tracking-wide mb-2">
            Booting System...
          </p>
          <p className="text-sm text-purple-500">
            Detecting network latency...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden ">
      {/* Background */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-500
          ${mode === "sleepy" ? "filter-sleep" : ""}
          ${mode === "colorblind" ? "filter-colorblind" : ""}`}
        style={{ backgroundImage: `url('/images/bkg4.png')` }}
      />

      <Image
        src="/images/screenMain1NoBkgWChat.png"
        alt="Main Computer Interface"
        fill
        priority
        className={`object-contain z-20 pointer-events-none transition-all duration-500
          ${mode === "sleepy" ? "filter-sleep" : ""}
          ${mode === "colorblind" ? "filter-colorblind" : ""}`}
      />

      {/* --- MAIN SCREEN --- */}
      <div className="absolute w-[25%] h-[40%] top-[16%] left-[37%] z-10 bg-black/80 rounded-sm text-center flex flex-col items-center justify-center p-4 overflow-hidden">
        <ComputerScreen
          getFaceSrc={getFaceSrc}
          staticOn={staticOn}
          displayText={displayText}
          questionText={questionText}
          isTyping={isTyping}
          mode={mode}
          hasStarted={hasStarted}
          handleStart={handleStart}
          currentQuestion={currentQuestion}
          handleAnswer={handleAnswer}
          selectedAnswer={selectedAnswer}
          messages={messages}
          chatStarted={chatStarted}
        />
      </div>

      {/* --- SKILL SELECTION DIALOG --- */}
      <DialogScreen show={showSkillTree}>
        <h2 className="text-xl font-semibold mb-4 text-white tracking-wide">Select up to 3 Subjects</h2>
        <div className="grid grid-cols-2 gap-3">
          {subjectsFromData.map((subj) => (
            <button
              key={subj}
              onClick={() => toggleSubject(subj)}
              className={`cursor-pointer px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200
                ${
                  chosenSubjects.includes(subj)
                    ? "bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 border-pink-400 text-white shadow-[0_0_15px_rgba(255,0,255,0.3)]"
                    : "bg-gray-800/70 border-gray-600 text-purple-300 hover:bg-gray-700/60 hover:border-pink-400 hover:text-pink-300"
                }`}
            >
              {subj}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-gray-400 tracking-wide">{chosenSubjects.length}/3 selected</p>
        <button
          onClick={handleConfirmSubjects}
          disabled={chosenSubjects.length < 1}
          className="cursor-pointer mt-4 px-6 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 
                    text-white hover:border-purple-400 hover:brightness-110 disabled:bg-gray-700 transition-all duration-200 shadow-md"
        >
          Confirm Selection
        </button>
      </DialogScreen>

      {/* --- TOP LEFT (TIME) --- */}
      <div className="absolute w-[17%] h-[22%] top-[12%] left-[16%] bg-black/70 rounded-sm flex flex-col items-center justify-center text-white text-xs">
        <TimeAndDate />
      </div>

      {/* --- BOTTOM LEFT (CONTROL) --- */}
      <div className="absolute w-[12%] h-[20%] top-[45%] left-[18%] bg-black/70 rounded-sm text-white">
        <ComputerControls
          typeText={(t, m, c) => typeText(t, m, c)}
          setHasStarted={setHasStarted}
          hasStarted={hasStarted}
          mode={mode}
          setMode={setMode}
          isIntro={isIntroPlaying}
        />
      </div>

      {/* --- TOP RIGHT (MODE STATUS) --- */}
      <div className="absolute w-[13%] h-[20%] top-[15%] right-[18%] bg-black/70 rounded-sm flex items-center justify-center text-white text-xs">
        <ComputerMode mode={mode} />
      </div>

      {/* --- BOTTOM RIGHT (SYSTEM INFO) --- */}
      <div className="absolute w-[12%] h-[20%] top-[43%] right-[18%] bg-black/70 rounded-sm flex flex-col gap-1 items-center justify-center text-white text-xs">
        <SystemInfo
          hasStarted={hasStarted}
          currentQuestionIndex={currentQuestionIndex}
          questions={questions}
          mode={
            booting
              ? "booting"
              : chatStarted
              ? "chatting"
              : hasStarted
              ? "testing"
              : "idle"
          }
        />

        <button
          onClick={() => setShowSkillTree(true)}
          disabled={booting || (testStarted && !testFinished) || chatStarted}
          className={`px-2 py-1 text-xs rounded-md font-medium text-white transition-all border cursor-pointer ${
            booting || (testStarted && !testFinished) || chatStarted
              ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-purple-800 border-purple-500 hover:bg-purple-700 hover:border-purple-400"
          }`}
        >
          Open Skill Tree
        </button>

        <button
          onClick={() => {
            if (testStarted && !testFinished) {
              alert("You cannot start the chatbot during test mode.");
              return;
            }
            setChatStarted((prev) => !prev);
          }}
          disabled={booting || (testStarted && !testFinished)}
          className={`px-2 py-1 text-xs rounded-md font-medium text-white transition-all border cursor-pointer ${
            booting || (testStarted && !testFinished)
              ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
              : chatStarted
              ? "bg-pink-800 border-pink-500 hover:bg-pink-700 hover:border-pink-400"
              : "bg-purple-800 border-purple-500 hover:bg-purple-700 hover:border-purple-400"
          }`}
        >
          {chatStarted ? "End Chatbot" : "Start Chatbot"}
        </button>
      </div>

      {/* --- CHAT INPUT --- */}
      <div className="absolute w-[35%] h-[10%] top-[75%] bg-black/70 rounded-sm flex items-center justify-center text-white text-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!chatStarted) return;
            const input = e.target.elements.chatInput;
            const value = input.value.trim();
            if (value) {
              handleSendMessage(value);
              input.value = "";
            }
          }}
          className="w-10/12 flex items-center gap-2"
        >
          <Input
            name="chatInput"
            placeholder={chatStarted ? "Type your message..." : "Chat disabled — start the chatbot to enable input"}
            disabled={!chatStarted}
            aria-disabled={!chatStarted}
            className={`flex-1 text-white bg-transparent border-purple-500/40 focus:border-pink-400 focus:ring-0
              ${!chatStarted ? "cursor-not-allowed text-gray-400 placeholder:text-gray-500" : ""}`}
          />
          <button
            type="submit"
            disabled={!chatStarted}
            aria-disabled={!chatStarted}
            title={chatStarted ? "Send message" : "Chat disabled"}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all border
              ${
                chatStarted
                  ? "bg-purple-700 hover:bg-purple-600 border-purple-400 text-white"
                  : "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
              }`}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
