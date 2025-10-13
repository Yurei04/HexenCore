"use client"

import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useState, useEffect } from "react";

export default function ComputerControls ({ questionType = "multiple"}) {

    const multipleChoice = [
        { id: "A", label: "Option A"},
        { id: "B", label: "Option B"},
        { id: "C", label: "Option C"},
        { id: "D", label: "Option D"},
    ];

    const trueOrFalse = [
        { id: "TRUE", label: "True"},
        { id: "FALSE", label: "False"},
    ];

    
    const [choices, setChoices] = useState(multipleChoice);
    const [selected, setSelected] = useState(null);

    useEffect(() => {

    })


    return (
        <div className="w-[43.75rem] h-[10.5rem] border-3 border-neutral-950 rounded-sm flex flex-col items-center justify-center p-5 m-6 z-100">
            <div className="w-[40.75rem] h-[29.25rem] border-2 border-neutral-950 z-90">
                <div className="w-full h-full items-center justify-evenly flex lg:flex-row sm:flex-col bg-amber-200 p-4">
                    {choices.map}
                </div>
            </div>
        </div>
    )
}