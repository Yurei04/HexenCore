"use client";
import React, {useState, useEffect} from "react";

export default function TimeAndDate () {

    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    return (
<div className="w-full h-full bg-[url('/images/control1.png')] bg-cover bg-center rounded-sm flex flex-col items-center justify-center p-5 m-6 z-100 scale-x-[-1]">
  <div className="w-full h-full z-90 scale-x-[-1]">
    <div className="w-full h-full flex flex-col items-center justify-evenly ">
      <p className="text-sm text-neutral-950">{dateTime.toLocaleDateString()}</p>
      <p className="text-2xl font-semibold mt-1">{dateTime.toLocaleTimeString()}</p>
    </div>
  </div>
</div>

    )
}