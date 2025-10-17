"use client";
import ComputerControls from "@/components/system/controls";
import ComputerMode from "@/components/system/mode";
import ComputerScreen from "@/components/system/screen";
import SystemInfo from "@/components/system/systemInfo";
import TimeAndDate from "@/components/system/time";
import Image from "next/image";
import { useState, useEffect } from "react";
import questionsData from "@/../public/data/questions.json";
import DialogScreen from "@/components/system/hexSkill";

export default function Home() {
  const [mode, setMode] = useState("booting");
  const [displayText, setDisplayText] = useState("");       // for system messages (Processing, prepare msg, results)
  const [questionText, setQuestionText] = useState("");     // for typed question text (separate)
  const [isTyping, setIsTyping] = useState(false);          // true while any typeText is running
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

  // -------------------------
  // Generic typewriter used for two contexts:
  // - question: writes into questionText
  // - message: writes into displayText
  // modeArg: "question" | "message"
  // -------------------------
  const typeText = (text, modeArg = "message", onComplete) => {
    setIsTyping(true);
    if (modeArg === "question") setQuestionText("");
    else setDisplayText("");

    let i = 0;
    const speed = modeArg === "message" ? 28 : 30; // you can tweak speeds separately
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

  // -------------------------
  // Load data (fetch with fallback)
  // -------------------------
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

  // -------------------------
  // Toggle subject and confirm
  // -------------------------
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
    // Use message typing to show preparing text, then start first question typing
    typeText("Excellent choices. Preparing your custom assessment...", "message", () => {
      setCurrentQuestionIndex(0);
      setHasStarted(true);
      // the question typing effect runs in the next effect below
    });
  };

  // -------------------------
  // Boot intro sequence
  // -------------------------
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
          setMode("skilltree");
          setIsIntroPlaying(false);
          setShowSkillTree(true);
          typeText(" Access granted. Please select up to three skill modules to begin your assessment.", "message");
        }, 700);
      }
    };
    runIntro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // static flicker
  useEffect(() => {
    const flicker = setInterval(() => setStaticOn((p) => !p), 200);
    return () => clearInterval(flicker);
  }, []);

  // -------------------------
  // QUESTION FLOW SEQUENCE
  // When currentQuestion changes (and hasStarted), type the question into questionText.
  // Only after that typing completes do we set a questioning mode and set startTime.
  // -------------------------
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (!hasStarted || !currentQuestion) return;

    // clear prior messages and question space, then type the new question
    setDisplayText("");
    setQuestionText("");
    // type question into questionText
    typeText(currentQuestion.question, "question", () => {
      // after question is typed, set mode that enables answers
      if (currentQuestion.type === "multiple") setMode("questioningMultiple");
      else if (currentQuestion.type === "torf") setMode("questioningTorF");
      else if (currentQuestion.type === "yesno") setMode("questioningNormal");
      else setMode("questioningMultiple");
      setStartTime(Date.now());
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, hasStarted, currentQuestion]);

  // -------------------------
  // handleStart (explicit)
  // -------------------------
  const handleStart = () => {
    if (questions.length === 0) {
      typeText(" No questions loaded yet.", "message");
      return;
    }
    setHasStarted(true);
    setCurrentQuestionIndex(0);
    setMode("talking");
    typeText(" Let's begin your assessment...", "message", () => {
      // question effect will pick up and type the first question
    });
  };

  // -------------------------
  // handleAnswer: record time, show processing message (typed), then move to next question or results
  // This uses separate displayText for processing so it doesn't overwrite typed questionText unexpectedly.
  // -------------------------
  const handleAnswer = (answer) => {
    if (!currentQuestion) return;

    const endTime = Date.now();
    const timeTaken = startTime ? (endTime - startTime) / 1000 : 0;
    // update answerTimes immediately
    setAnswerTimes((prev) => [...prev, timeTaken]);

    setSelectedAnswer(answer);

    if (answer === currentQuestion.answer) {
      setCorrectedAnswers((prev) => prev + 1);
    }

    // disable options and type the processing message
    setMode("talking");
    typeText(" Processing your response...", "message", () => {
      // after processing message typed, clear it and advance
      setDisplayText("");

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        // next question will be typed by effect above
      } else {
        // compute average using the answerTimes state snapshot
        // (we pushed current time above with setAnswerTimes; small timing nuance but acceptable)
        // create a snapshot by combining answerTimes + timeTaken to be safer
        const snapshot = [...answerTimes, timeTaken];
        const totalTime = snapshot.reduce((a, b) => a + b, 0);
        const averageTime = snapshot.length ? totalTime / snapshot.length : 0;

        // final message typed
        typeText(
          ` Assessment complete. Well done!
            Average time per question: ${averageTime.toFixed(2)}s`,
          "message",
          () => {
            setMode("idle");
            setCurrentQuestionIndex(0);
            setCorrectedAnswers(0);
            setHasStarted(false);
            setAnswerTimes([]);
            setTestFinished(true);
            setTestStarted(false);
          }
        );
      }
    });
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

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden ">
      {/* Background */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-500
          ${mode === "sleepy" ? "filter-sleep" : ""}
          ${mode === "colorblind" ? "filter-colorblind" : ""}`}
        style={{ backgroundImage: `url('/images/bkg4.png')` }}
      />

      {/* Foreground Image */}
      <Image
        src="/images/screenMain1NoBkg.png"
        alt="Main Computer Interface"
        fill
        priority
        className={`object-contain z-20 pointer-events-none transition-all duration-500
          ${mode === "sleepy" ? "filter-sleep" : ""}
          ${mode === "colorblind" ? "filter-colorblind" : ""}`}
      />

      {/* --- MAIN SCREEN (RESTORED POSITION) --- */}
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
        />
      </div>

      {/* Skill selection dialog */}
      <DialogScreen show={showSkillTree}>
        <h2 className="text-xl font-semibold mb-4">Select up to 3 Subjects</h2>
        <div className="grid grid-cols-2 gap-4">
          {subjectsFromData.map((subj) => (
            <button
              key={subj}
              onClick={() => toggleSubject(subj)}
              className={`px-4 py-2 rounded-md border transition-all ${
                chosenSubjects.includes(subj)
                  ? "bg-purple-500 border-purple-400"
                  : "bg-transparent border-white/40 hover:border-purple-300"
              }`}
            >
              {subj}
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm text-gray-300">{chosenSubjects.length}/3 selected</p>

        <button
          onClick={() => {
            handleConfirmSubjects();
          }}
          disabled={chosenSubjects.length < 1}
          className="mt-6 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:bg-gray-600"
        >
          Confirm Selection
        </button>
      </DialogScreen>

      {/* --- TOP LEFT (DATE/TIME) --- */}
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
        <SystemInfo hasStarted={hasStarted} currentQuestionIndex={currentQuestionIndex} questions={questions} />
        <button
          onClick={() => setShowSkillTree(true)}
          disabled={testStarted && !testFinished}
          className={`px-4 py-2 rounded-md text-white transition-all ${
            testStarted && !testFinished ? "bg-gray-600 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          Open Skill Tree
        </button>
      </div>
    </div>
  );
}
