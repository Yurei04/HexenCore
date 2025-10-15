
"use client";
import { useEffect } from "react";
import { useMode } from "./modeContext";

export default function ComputerMode() {
  const { sleep, colorblind, eyeSight } = useMode();

  useEffect(() => {
    const body = document.body;

    body.classList.remove("sleep-mode", "colorblind-mode", "eyeSight-mode");

    if (sleep) body.classList.add("sleep-mode");
    if (colorblind) body.classList.add("colorblind-mode");
    if (eyeSight) body.classList.add("eyeSight-mode");
  }, [sleep, colorblind, eyeSight]);

  return null;
}
