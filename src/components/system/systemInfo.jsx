
export default function SystemInfo ({
    hasStarted,
    currentQuestionIndex,
    questions
}) {
    return (
        <div className="flex flex-col">
            <p>
            {hasStarted
                ? `Question ${currentQuestionIndex + 1}/${questions.length}`
                : "System Ready"}
            </p>
        </div>
    )
}