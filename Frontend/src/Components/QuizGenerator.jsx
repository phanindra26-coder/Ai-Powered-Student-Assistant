import { useState } from "react";
import api from "../services/api";

function QuizGenerator() {
    const [topic, setTopic] = useState("");
    const [difficulty, setDifficulty] = useState("medium");
    const [count, setCount] = useState(5);
    const [quiz, setQuiz] = useState([]);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const generateQuiz = async () => {
        if (!topic.trim()) {
            setError("Please enter a topic first.");
            return;
        }

        setLoading(true);
        setError("");
        setQuiz([]);
        setAnswers({});
        setSubmitted(false);
        setScore(null);

        try {
            const data = await api.post("/api/quiz/generate", {
                topic: topic.trim(),
                difficulty: difficulty,
                numberOfQuestions: count
            });

            setQuiz(data.questions || []);
        } catch (err) {
            setError(err.message || "Failed to generate quiz. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionIndex, answerIndex) => {
        if (submitted) return; // Prevent changing answers after submit
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: answerIndex
        }));
    };

    const handleSubmitQuiz = async () => {
        if (Object.keys(answers).length < quiz.length) {
            if (!window.confirm("You have unanswered questions. Do you still want to submit?")) {
                return;
            }
        }

        // Calculate score
        let calculatedScore = 0;
        quiz.forEach((item, index) => {
            if (answers[index] === item.answer) {
                calculatedScore += 1;
            }
        });

        const scorePercentage = Math.round((calculatedScore / quiz.length) * 100);

        try {
            // Save quiz results to progress
            await api.post("/api/progress", {
                subject: topic.trim(),
                quiz_score: scorePercentage,
                quiz_attempts: 1
            });
        } catch (err) {
            console.error("Failed to save progress:", err.message);
        }

        setScore(calculatedScore);
        setSubmitted(true);
    };

    return (
        <section>
            <div className="section-header">
                <h1>❓ Quiz Generator</h1>
                <p>Test your knowledge with AI-generated questions.</p>
            </div>

            <div className="generator-card">
                <label>Enter Topic</label>
                <input
                    type="text"
                    value={topic}
                    onChange={(event) => setTopic(event.target.value)}
                    placeholder="Example: Java OOP"
                />

                <label>Difficulty Level</label>
                <select
                    value={difficulty}
                    onChange={(event) => setDifficulty(event.target.value)}
                >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>

                <label>Number of Questions</label>
                <select
                    value={count}
                    onChange={(event) => setCount(Number(event.target.value))}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                </select>

                <button onClick={generateQuiz} disabled={loading} className="cta-button">
                    {loading ? "Generating..." : "Generate Quiz"}
                </button>
            </div>

            <div className="result-card">
                <h2>🧠 Quiz</h2>

                {error && (
                    <p style={{ color: "#ef4444", fontWeight: "500" }}>
                        {error}
                    </p>
                )}

                {quiz.length === 0 && !loading && (
                    <p>Your quiz questions will appear here.</p>
                )}

                {quiz.map((item, index) => (
                    <div className="quiz-question" key={index} style={{ marginBottom: "24px" }}>
                        <h3>
                            Q{index + 1}. {item.question}
                        </h3>

                        {/* Show correct answer ONLY after submission */}
                        {submitted && (
                            <p style={{ fontSize: "0.9rem", color: "#16a34a", fontWeight: "600", marginTop: "8px", marginBottom: "12px" }}>
                                Correct Answer: {item.options[item.answer]}
                            </p>
                        )}

                        {item.options.map((option, optionIndex) => (
                            <p key={optionIndex}>
                                <label style={{ cursor: submitted ? "default" : "pointer" }}>
                                    <input
                                        type="radio"
                                        name={`question-${index}`}
                                        value={optionIndex}
                                        checked={answers[index] === optionIndex}
                                        disabled={submitted}
                                        onChange={() => handleAnswerChange(index, optionIndex)}
                                    />
                                    {" "}
                                    {option}
                                </label>
                            </p>
                        ))}

                        {/* Show explanation ONLY after submission */}
                        {submitted && item.explanation && (
                            <p style={{ fontSize: "0.9rem", color: "#555", marginTop: "12px", fontStyle: "italic", borderLeft: "3px solid #3b82f6", paddingLeft: "12px" }}>
                                {item.explanation}
                            </p>
                        )}
                    </div>
                ))}

                {/* Submit button & Score section */}
                {quiz.length > 0 && (
                    <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #e5e7eb" }}>
                        {!submitted ? (
                            <button onClick={handleSubmitQuiz} className="cta-button">
                                Submit Quiz
                            </button>
                        ) : (
                            <div className="score-box" style={{ padding: "16px", backgroundColor: "#f3f4f6", borderRadius: "8px" }}>
                                <h3>Quiz Results</h3>
                                <p style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#1d4ed8" }}>
                                    You scored {score} out of {quiz.length}!
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

export default QuizGenerator;