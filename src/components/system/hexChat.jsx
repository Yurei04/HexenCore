"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function HexChat({ chatStarted, onSendMessage }) {
  const [message, setMessage] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
    }
  };

  if (!chatStarted) return null; // don’t show when chatbot hasn’t started

  return (
    <div className="absolute w-[35%] h-[10%] top-[75%] bg-black/70 rounded-sm flex items-center justify-center text-white text-xs">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="w-10/12"
      />
    </div>
  );
}
