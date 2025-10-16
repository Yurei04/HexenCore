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
  const [correctAnswers, setCorrectedAnswers] = useState(0)
  const [results, setResults] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [allSubjects, setAllSubjects] = useState({});
  const [chosenSubjects, setChosenSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answerTimes, setAnswerTimes] = useState([]);
  const [isIntroPlaying, setIsIntroPlaying] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showSkillTree, setShowSkillTree] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [testFinished, setTestFinished] = useState(false);


  const subjects = ["Math", "Science", "History", "Tech", "Art", "Language"];
  const [selected, setSelected] = useState([]);

  const toggleSubject = (subject) => {
    if (selected.includes(subject)) {
      setSelected(selected.filter((s) => s !== subject));
    } else if (selected.length < 3) {
      setSelected([...selected, subject]);
    }
  };
  
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
const handleSubjectSelect = (subject) => {
    setChosenSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : prev.length < 3
        ? [...prev, subject]
        : prev
    );
  };

  // 👇 called when user confirms subject choices
  const handleSkillConfirm = () => {
    const selectedQuestions = chosenSubjects.flatMap((subj) => {
      const subjectQs = allSubjects[subj];
      return subjectQs.sort(() => 0.5 - Math.random()).slice(0, 6);
    });

    setQuestions(selectedQuestions);
    setMode("talking");
    typeText("Excellent choices. Preparing your custom assessment...");
    setTimeout(() => {
      setMode("questioningMultiple");
      setHasStarted(true);
    }, 2000);
  };
  
  useEffect(() => {
    setAllSubjects(questionsData.subjects);
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
          // After intro finishes, go to skilltree once
          setTimeout(() => {
            setMode("skilltree");
            setIsIntroPlaying(false);
            setShowSkillTree(true);
            typeText(" Access granted. Please select up to three skill modules to begin your assessment.");
          }, 1000);
        }
      };

      runIntro();
    }
    // Only run when booting starts, not on every mode change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode === "booting"]);



  useEffect(() => {
    if (!currentQuestion) return;
    if (currentQuestion.type === "multiple") setMode("questioningMultiple");
    else if (currentQuestion.type === "torf") setMode("questioningTorF");
    else if (currentQuestion.type === "yesno") setMode("questioningNormal");
  }, [currentQuestionIndex]);

  const handleStart = () => {
    if (questions.length === 0) return typeText("No questions loaded yet.");
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
        setTestFinished(true);
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

       <DialogScreen show={showSkillTree}>
          <h2 className="text-xl font-semibold mb-4">Select up to 3 Subjects</h2>
          <div className="grid grid-cols-2 gap-4">
            {subjects.map((subj) => (
              <button
                key={subj}
                onClick={() => toggleSubject(subj)}
                className={`px-4 py-2 rounded-md border transition-all ${
                  selected.includes(subj)
                    ? "bg-purple-500 border-purple-400"
                    : "bg-transparent border-white/40 hover:border-purple-300"
                }`}
              >
                {subj}
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm text-gray-300">{selected.length}/3 selected</p>

          <button
            onClick={() => {
              setTestStarted(false);
              setShowSkillTree(false);
              setMode("idle");
              typeText("  Subjects confirmed.");
            }}
            disabled={selected.length < 3}
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
        <ComputerMode mode={mode}/>
      </div>

      {/* --- BOTTOM RIGHT (SYSTEM INFO) --- */}
      <div className="absolute w-[12%] h-[20%] top-[43%] right-[18%] bg-black/70 rounded-sm flex flex-col gap-1 items-center justify-center text-white text-xs">
        <SystemInfo
          hasStarted={hasStarted}
          currentQuestionIndex={currentQuestionIndex}
          questions={questions}
        />
        <button
          onClick={() => setShowSkillTree(true)}
          disabled={testStarted && !testFinished}
          className={`px-4 py-2 rounded-md text-white transition-all ${
            testStarted && !testFinished
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          Open Skill Tree
        </button>

      </div>
    </div>
  );
}
