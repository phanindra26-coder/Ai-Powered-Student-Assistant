import { useState } from "react";
import api from "../services/api";

function NotesGenerator() {

    const [topic, setTopic] = useState("");

    const [level, setLevel] =
        useState("beginner");

    const [length, setLength] =
        useState("medium");

    const [notes, setNotes] =
        useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    const generateNotes = async () => {

        if (!topic.trim()) {

            setError("Please enter a topic first.");

            return;
        }

        setLoading(true);
        setError("");
        setNotes("");

        try {
            const data = await api.post("/api/notes/generate", {
                topic: topic.trim(),
                level: level,
                length: length
            });

            setNotes(data.content || "");

            // Save progress
            try {
                await api.post("/api/progress", {
                    subject: topic.trim(),
                    study_minutes: 5
                });
            } catch (err) {
                console.error("Failed to save progress:", err.message);
            }
        } catch (err) {
            setError(err.message || "Failed to generate notes. Please try again.");
        } finally {
            setLoading(false);
        }

    };


    return (

        <section>

            <div className="section-header">

                <h1>
                    📝 Notes Generator
                </h1>

                <p>
                    Generate simple and understandable
                    study notes.
                </p>

            </div>


            <div className="generator-card">

                <label>
                    Enter Topic
                </label>

                <input
                    type="text"
                    value={topic}
                    onChange={(event) =>
                        setTopic(event.target.value)
                    }
                    placeholder="Example: Operating System"
                />


                <label>
                    Difficulty Level
                </label>

                <select
                    value={level}
                    onChange={(event) =>
                        setLevel(event.target.value)
                    }
                >

                    <option value="beginner">
                        Beginner
                    </option>

                    <option value="intermediate">
                        Intermediate
                    </option>

                    <option value="advanced">
                        Advanced
                    </option>

                </select>


                <label>
                    Length
                </label>

                <select
                    value={length}
                    onChange={(event) =>
                        setLength(event.target.value)
                    }
                >

                    <option value="short">
                        Short
                    </option>

                    <option value="medium">
                        Medium
                    </option>

                    <option value="long">
                        Long
                    </option>

                </select>


                <button onClick={generateNotes} disabled={loading} className="cta-button">
                    {loading ? "Generating..." : "Generate Notes"}
                </button>

            </div>


            <div className="result-card">

                <h2>
                    Generated Notes
                </h2>

                {error && (
                    <p style={{ color: "#ef4444", fontWeight: "500" }}>
                        {error}
                    </p>
                )}

                {notes ? (
                    <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
                        {notes}
                    </p>
                ) : (
                    <p>
                        Your AI-generated notes will appear here.
                    </p>
                )}

            </div>

        </section>

    );
}

export default NotesGenerator;