"use client";
import React, {useState, useEffect} from "react";

export default function TimeAndDate () {

    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-[18.5rem] h-[10.5rem] border-3 border-neutral-950 rounded-sm flex flex-col items-center justify-center p-5 m-6 z-100">
            <div className="w-[15.5rem] h-[18rem] border-2 border-neutral-950 z-90">
                <div className="w-full h-full flex flex-col items-center justify-evenly bg-amber-200">
                    <p className="text-sm text-neutral-950">{dateTime.toLocaleDateString()}</p>
                    <p className="text-2xl font-semibold mt-1">{dateTime.toLocaleTimeString()}</p>
                </div>
            </div>
        </div>
    )
}