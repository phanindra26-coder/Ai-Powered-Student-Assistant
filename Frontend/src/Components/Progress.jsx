import { useEffect, useState } from "react";
import api from "../services/api";

function Progress() {
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadProgress();
    }, []);

    const loadProgress = async () => {
        setLoading(true);
        try {
            const data = await api.get("/api/progress");
            const rows = data.progress || [];

            const mapped = rows.map((item) => ({
                id: item.id,
                name: item.subject,
                percentage: Math.min(Math.max(Number(item.quiz_score || 0), 0), 100),
                completedTasks: Number(item.completed_tasks || 0),
                quizAttempts: Number(item.quiz_attempts || 0),
                studyMinutes: Number(item.study_minutes || 0),
            }));

            setProgressData(mapped);
            setError("");
        } catch (err) {
            setProgressData([]);
            setError(err.message || "Failed to load progress data");
        } finally {
            setLoading(false);
        }
    };

    const totalStudyMinutes = progressData.reduce((sum, item) => sum + item.studyMinutes, 0);
    const totalCompletedTasks = progressData.reduce((sum, item) => sum + item.completedTasks, 0);
    const totalQuizAttempts = progressData.reduce((sum, item) => sum + item.quizAttempts, 0);
    const averageScore = progressData.length
        ? Math.round(progressData.reduce((sum, item) => sum + item.percentage, 0) / progressData.length)
        : 0;

    return (
        <section>
            <div className="section-header">
                <h1>📊 My Progress</h1>
                <p>Track your learning progress.</p>
            </div>

            {loading && <p className="loading-text">Loading progress...</p>}
            {error && !progressData.length && <p className="error-text">{error}</p>}

            {progressData.length === 0 ? (
                <div className="empty-state-box">
                    <p>No progress data yet.</p>
                </div>
            ) : (
                <>
                    <div className="stats">
                        <div className="stat-card">
                            <div className="stat-icon">⏱️</div>
                            <div>
                                <h3>{totalStudyMinutes}m</h3>
                                <p>Total study time</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">✅</div>
                            <div>
                                <h3>{totalCompletedTasks}</h3>
                                <p>Completed tasks</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🧪</div>
                            <div>
                                <h3>{totalQuizAttempts}</h3>
                                <p>Quiz attempts</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">📈</div>
                            <div>
                                <h3>{averageScore}%</h3>
                                <p>Average score</p>
                            </div>
                        </div>
                    </div>

                    <div className="progress-dashboard">
                        {progressData.map((subject) => (
                            <div className="progress-card" key={subject.id}>
                                <h3>{subject.name}</h3>
                                <strong>{subject.percentage}%</strong>
                                <div className="progress-bar">
                                    <div className="progress" style={{ width: `${subject.percentage}%` }} />
                                </div>
                                <div className="progress-metrics">
                                    <p>Tasks: {subject.completedTasks}</p>
                                    <p>Quizzes: {subject.quizAttempts}</p>
                                    <p>Study Time: {subject.studyMinutes}m</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}

export default Progress;