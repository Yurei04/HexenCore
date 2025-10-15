"use client";

export default function TimeAndDate () {
    return (
      <div className="flex flex-col">
            <p>{new Date().toLocaleDateString()}</p>
            <p className="text-lg font-semibold">
              {new Date().toLocaleTimeString()}
            </p>
      </div>

    )
}
