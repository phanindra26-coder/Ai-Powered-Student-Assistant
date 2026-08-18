import { useEffect, useState } from "react";
import api from "../services/api";

const emptyForm = {
    subject: "",
    task: "",
    description: "",
    date: "",
    start_time: "",
    end_time: "",
    priority: "medium",
    status: "pending",
};

function StudyPlanner() {
    const [form, setForm] = useState(emptyForm);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await api.get("/api/planner");
            setPlans(data.plans || []);
        } catch (err) {
            console.error("Error loading plans:", err);
            setError(err.message || "Failed to load study plans. Make sure backend is running.");
            setPlans([]);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.subject.trim() || !form.task.trim()) {
            setError("Subject and task are required.");
            return;
        }

        try {
            setError("");

            const payload = {
                subject: form.subject.trim(),
                task: form.task.trim(),
                description: form.description.trim(),
                date: form.date || null,
                start_time: form.start_time || null,
                end_time: form.end_time || null,
                priority: form.priority,
                status: form.status,
            };

            if (editingId) {
                await api.put(`/api/planner/${editingId}`, payload);
            } else {
                await api.post("/api/planner", payload);
            }

            resetForm();
            await loadPlans();
        } catch (err) {
            setError(err.message || "Failed to save study plan");
        }
    };

    const handleEdit = (plan) => {
        setEditingId(plan.id);
        setForm({
            subject: plan.subject || "",
            task: plan.task || "",
            description: plan.description || "",
            date: plan.date || "",
            start_time: plan.start_time || "",
            end_time: plan.end_time || "",
            priority: plan.priority || "medium",
            status: plan.status || "pending",
        });
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/planner/${id}`);
            if (editingId === id) {
                resetForm();
            }
            await loadPlans();
        } catch (err) {
            setError(err.message || "Failed to delete plan");
        }
    };

    const handleComplete = async (plan) => {
        try {
            const newStatus = plan.status === "completed" ? "pending" : "completed";
            await api.put(`/api/planner/${plan.id}`, {
                ...plan,
                status: newStatus,
            });

            if (newStatus === "completed") {
                try {
                    await api.post("/api/progress", {
                        subject: plan.subject,
                        completed_tasks: 1
                    });
                } catch (err) {
                    console.error("Failed to save progress:", err.message);
                }
            }

            await loadPlans();
        } catch (err) {
            setError(err.message || "Failed to update plan status");
        }
    };

    const visiblePlans = plans.filter((plan) => {
        if (filter === "today") {
            const today = new Date().toISOString().slice(0, 10);
            return plan.date === today;
        }

        if (filter === "pending") {
            return plan.status !== "completed";
        }

        if (filter === "completed") {
            return plan.status === "completed";
        }

        return true;
    });

    return (
        <section>
            <div className="section-header">
                <h1>📅 Study Planner</h1>
                <p>Create, review, and track your study tasks.</p>
            </div>

            <div className="planner-layout">
                <div className="generator-card planner-form">
                    <form onSubmit={handleSubmit}>
                        <label>Subject</label>
                        <input
                            type="text"
                            value={form.subject}
                            onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
                            placeholder="e.g., Java"
                        />

                        <label>Task</label>
                        <input
                            type="text"
                            value={form.task}
                            onChange={(event) => setForm((prev) => ({ ...prev, task: event.target.value }))}
                            placeholder="e.g., Learn collections framework"
                        />

                        <label>Description</label>
                        <textarea
                            value={form.description}
                            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                            placeholder="Optional notes or study goals"
                            rows="3"
                        />

                        <div className="planner-row">
                            <div>
                                <label>Date</label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                                />
                            </div>
                            <div>
                                <label>Priority</label>
                                <select
                                    value={form.priority}
                                    onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>

                        <div className="planner-row">
                            <div>
                                <label>Start time</label>
                                <input
                                    type="time"
                                    value={form.start_time}
                                    onChange={(event) => setForm((prev) => ({ ...prev, start_time: event.target.value }))}
                                />
                            </div>
                            <div>
                                <label>End time</label>
                                <input
                                    type="time"
                                    value={form.end_time}
                                    onChange={(event) => setForm((prev) => ({ ...prev, end_time: event.target.value }))}
                                />
                            </div>
                        </div>

                        <label>Status</label>
                        <select
                            value={form.status}
                            onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>

                        <div className="planner-actions">
                            <button type="submit" disabled={loading} className="cta-button">
                                {loading ? "Saving..." : editingId ? "Update Task" : "Add Task"}
                            </button>
                            {editingId && (
                                <button type="button" className="secondary-button light" onClick={resetForm}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="result-card planner-list">
                    <div className="planner-header-row">
                        <h2>📋 Your Tasks</h2>
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="all">All tasks</option>
                            <option value="today">Today</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    {error && <p className="error-text">{error}</p>}

                    {visiblePlans.length === 0 ? (
                        <p className="empty-state-text">No study tasks yet. Add one to get started.</p>
                    ) : (
                        visiblePlans.map((item) => (
                            <div className="planner-item" key={item.id}>
                                <div className="planner-item-main">
                                    <div className="planner-title-row">
                                        <strong>{item.subject}</strong>
                                        <span className={`priority-badge ${item.priority || "medium"}`}>{item.priority || "medium"}</span>
                                    </div>
                                    <p>{item.task}</p>
                                    {item.description && <small>{item.description}</small>}
                                    <div className="planner-meta">
                                        {item.date && <span>{new Date(item.date).toLocaleDateString()}</span>}
                                        {item.start_time && <span>{item.start_time}</span>}
                                        {item.end_time && <span>{item.end_time}</span>}
                                    </div>
                                </div>

                                <div className="planner-actions-inline">
                                    <button type="button" className="mini-button success" onClick={() => handleComplete(item)}>
                                        {item.status === "completed" ? "Undo" : "Done"}
                                    </button>
                                    <button type="button" className="mini-button" onClick={() => handleEdit(item)}>
                                        Edit
                                    </button>
                                    <button type="button" className="mini-button danger" onClick={() => handleDelete(item.id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}

export default StudyPlanner;