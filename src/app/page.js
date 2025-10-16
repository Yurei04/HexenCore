"use client";
import ComputerControls from "@/components/system/controls";
import ComputerMode from "@/components/system/mode";
import { ModeProvider } from "@/components/system/modeContext";
import ComputerScreen from "@/components/system/screen";
import SystemInfo from "@/components/system/systemInfo";
import TimeAndDate from "@/components/system/time";
import Image from "next/image";
import { useState, useEffect } from "react";
import questionsData from "@/../public/data/questions.json";
import DialogScreen from "@/components/system/hexSkill";

export default function Home() {
  const [mode, setMode] = useState("booting");
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [staticOn, setStaticOn] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [correctAnswers, setCorrectedAnswers] = useState(0);
  const [results, setResults] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [allSubjects, setAllSubjects] = useState({}); // object keyed by subject name
  const [chosenSubjects, setChosenSubjects] = useState([]); // single source of truth for selected subjects
  const [questions, setQuestions] = useState([]);
  const [answerTimes, setAnswerTimes] = useState([]);
  const [isIntroPlaying, setIsIntroPlaying] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showSkillTree, setShowSkillTree] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [testFinished, setTestFinished] = useState(false);

  // fallback subjects if JSON hasn't loaded yet
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

    closing: [" System Shutting Down...", " Thank you and have a good day:)"],
  };

  // Toggle a subject in chosenSubjects (max 3)
  const toggleSubject = (subject) => {
    setChosenSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : prev.length < 3 ? [...prev, subject] : prev
    );
  };

  // Confirm selected subjects and prepare questions
  const handleConfirmSubjects = () => {
    if (chosenSubjects.length < 1) {
      typeText(" Please select at least one subject.");
      return;
    }

    // prepare questions: up to 6 per selected subject, randomly sampled
    const selectedQuestions = chosenSubjects.flatMap((subj) => {
      const subjectQs = allSubjects[subj] || [];
      // clone array before sorting to avoid mutating source
      const clone = [...subjectQs];
      return clone.sort(() => 0.5 - Math.random()).slice(0, 6);
    });

    if (selectedQuestions.length === 0) {
      typeText(" No questions found for the selected subjects.");
      return;
    }

    setQuestions(selectedQuestions);
    setShowSkillTree(false);
    setTestStarted(true);
    setMode("talking");
    typeText("Excellent choices. Preparing your custom assessment...");
    // begin after a short delay so the 'typing' message is visible
    setTimeout(() => {
      setMode("questioningMultiple");
      setHasStarted(true);
      setCurrentQuestionIndex(0);
      setStartTime(Date.now());
    }, 1500);
  };

  // Load data (try fetch first; fallback to imported JSON)
  useEffect(() => {
    let mounted = true;
    fetch("/data/questions.json")
      .then((res) => {
        if (!res.ok) throw new Error("Network response not ok");
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        if (data && data.subjects) {
          setAllSubjects(data.subjects);
        } else if (questionsData && questionsData.subjects) {
          // fallback if fetched JSON has different shape
          setAllSubjects(questionsData.subjects);
        } else {
          console.error("Invalid JSON structure from fetch:", data);
        }
      })
      .catch((err) => {
        // fallback to imported JSON if fetch fails (useful during dev / static builds)
        if (questionsData && questionsData.subjects) {
          setAllSubjects(questionsData.subjects);
        } else {
          console.error("Error loading question data:", err);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

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

  // Start time when a question flow begins
  useEffect(() => {
    if (hasStarted && mode.includes("questioning")) {
      setStartTime(Date.now());
    }
  }, [currentQuestionIndex, hasStarted, mode]);

  // static flicker effect
  useEffect(() => {
    const flicker = setInterval(() => {
      setStaticOn((prev) => !prev);
    }, 200);
    return () => clearInterval(flicker);
  }, []);

  // Boot sequence: run only when mode is booting
  useEffect(() => {
    if (mode !== "booting") return;

    let i = 0;
    const runIntro = () => {
      if (i < dialogues.intro.length) {
        typeText(dialogues.intro[i], () => {
          i++;
          setTimeout(runIntro, 1000);
        });
      } else {
        setTimeout(() => {
          setMode("skilltree");
          setIsIntroPlaying(false);
          setShowSkillTree(true);
          typeText(" Access granted. Please select up to three skill modules to begin your assessment.");
        }, 1000);
      }
    };

    runIntro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Adjust mode depending on the current question's type
  useEffect(() => {
    if (!currentQuestion) return;
    if (currentQuestion.type === "multiple") setMode("questioningMultiple");
    else if (currentQuestion.type === "torf") setMode("questioningTorF");
    else if (currentQuestion.type === "yesno") setMode("questioningNormal");
    // include currentQuestionIndex in deps so it reacts when index changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, currentQuestion]);

  const handleStart = () => {
    if (questions.length === 0) {
      typeText(" No questions loaded yet.");
      return;
    }
    setHasStarted(true);
    setCurrentQuestionIndex(0);
    setMode("talking");
    typeText(" Let's begin your assessment...");
    setTimeout(() => {
      setMode("questioningMultiple");
    }, 2000);
  };

  const handleAnswer = (answer) => {
    const endTime = Date.now();
    const timeTaken = startTime ? (endTime - startTime) / 1000 : 0;

    // include this answer time immediately
    const newAnswerTimes = [...answerTimes, timeTaken];
    setAnswerTimes(newAnswerTimes);

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
        setStartTime(Date.now());
      } else {
        // compute average time using the up-to-date newAnswerTimes
        const totalTime = newAnswerTimes.reduce((a, b) => a + b, 0);
        const averageTime = newAnswerTimes.length ? totalTime / newAnswerTimes.length : 0;

        typeText(
          ` Assessment complete. Well done!
Average time per question: ${averageTime.toFixed(2)}s`
        );

        setMode("idle");
        setCurrentQuestionIndex(0);
        setCorrectedAnswers(0);
        setHasStarted(false);
        setAnswerTimes([]);
        setTestFinished(true);
        setTestStarted(false);
      }
    }, 2000);
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
            // do not override mode to idle here; handleConfirmSubjects manages flow
            // reset test flags as appropriate
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
          typeText={typeText}
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
