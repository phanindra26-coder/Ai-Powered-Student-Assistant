import { useEffect, useRef, useState } from "react";
import api from "../services/api";

function AIAssistant() {
    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isLoadingSessions, setIsLoadingSessions] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        loadSessions();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, currentSessionId]);

    const loadSessions = async () => {
        setIsLoadingSessions(true);

        try {
            const data = await api.get("/api/chat/sessions");
            setSessions(data.sessions || []);

            if (data.sessions && data.sessions.length > 0) {
                setCurrentSessionId(data.sessions[0].id);
                await loadSessionConversation(data.sessions[0].id);
            } else {
                setCurrentSessionId(null);
                setMessages([]);
            }
        } catch (err) {
            setError(err.message || "Unable to load chat history.");
        } finally {
            setIsLoadingSessions(false);
        }
    };

    const loadSessionConversation = async (sessionId) => {
        try {
            const data = await api.get(`/api/chat/sessions/${sessionId}`);
            const loadedMessages = (data.messages || []).map((msg) => ({
                id: msg.id,
                sender: msg.role === "user" ? "user" : "ai",
                text: msg.message,
            }));

            setMessages(loadedMessages);
        } catch (err) {
            setError(err.message || "Unable to load conversation.");
        }
    };

    const createSession = async (title = "New Chat") => {
        const sessionData = await api.post("/api/chat/sessions", { title });
        const newSession = sessionData.session;

        setSessions((previous) => [newSession, ...previous]);
        setCurrentSessionId(newSession.id);
        setMessages([]);

        return newSession;
    };

    const handleSelectSession = async (sessionId) => {
        setCurrentSessionId(sessionId);
        setError("");
        await loadSessionConversation(sessionId);
    };

    const handleDeleteSession = async (sessionId) => {
        try {
            setError("");
            await api.delete(`/api/chat/sessions/${sessionId}`);

            const updatedSessions = sessions.filter((session) => session.id !== sessionId);
            setSessions(updatedSessions);

            if (currentSessionId === sessionId) {
                if (updatedSessions.length > 0) {
                    const nextSession = updatedSessions[0];
                    setCurrentSessionId(nextSession.id);
                    await loadSessionConversation(nextSession.id);
                } else {
                    setCurrentSessionId(null);
                    setMessages([]);
                }
            }
        } catch (err) {
            setError(err.message || "Unable to delete chat.");
        }
    };

    const sendMessage = async (event) => {
        event.preventDefault();

        const trimmedInput = input.trim();
        if (!trimmedInput || loading) {
            return;
        }

        setError("");
        setLoading(true);

        const userMessage = {
            id: Date.now(),
            sender: "user",
            text: trimmedInput,
        };

        const sessionId = currentSessionId || null;

        try {
            let activeSessionId = sessionId;

            if (!activeSessionId) {
                const newSession = await createSession(trimmedInput.slice(0, 40));
                activeSessionId = newSession.id;
            }

            setMessages((previous) => [...previous, userMessage]);
            setInput("");

            const response = await api.post(`/api/chat/sessions/${activeSessionId}/messages`, {
                message: trimmedInput,
            });

            setMessages((previous) => [
                ...previous,
                {
                    id: Date.now() + 1,
                    sender: "ai",
                    text: response.reply,
                },
            ]);

            await loadSessions();
        } catch (err) {
            setError(err.message || "Unable to send message.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <div className="section-header">
                <h1>🤖 AI Assistant</h1>
                <p>Ask questions and get instant explanations.</p>
            </div>

            <div className="chat-layout" style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "16px" }}>
                <aside className="chat-sidebar" style={{ background: "#fff", borderRadius: "12px", padding: "16px", border: "1px solid #e5e7eb" }}>
                    <button
                        type="button"
                        className="nav-item"
                        onClick={() => {
                            setCurrentSessionId(null);
                            setMessages([]);
                            setError("");
                        }}
                        style={{ width: "100%", marginBottom: "12px" }}
                    >
                        + New Chat
                    </button>

                    {isLoadingSessions ? (
                        <p>Loading chats...</p>
                    ) : sessions.length === 0 ? (
                        <p>No conversations yet.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {sessions.map((session) => (
                                <div
                                    key={session.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        background: currentSessionId === session.id ? "#e0ecff" : "#f3f4f6",
                                        padding: "10px 12px",
                                        borderRadius: "8px",
                                        gap: "8px",
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => handleSelectSession(session.id)}
                                        style={{
                                            flex: 1,
                                            background: "transparent",
                                            border: "none",
                                            textAlign: "left",
                                            cursor: "pointer",
                                            color: "#111827",
                                            fontWeight: "600",
                                        }}
                                    >
                                        {session.title || "Untitled Chat"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDeleteSession(session.id)}
                                        style={{ background: "transparent", border: "none", cursor: "pointer" }}
                                        aria-label="Delete chat"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </aside>

                <div className="chat-container" style={{ background: "#fff", borderRadius: "12px", padding: "16px", border: "1px solid #e5e7eb" }}>
                    <div className="chat-messages" style={{ minHeight: "300px", maxHeight: "480px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", paddingRight: "8px" }}>
                        {messages.length === 0 ? (
                            <div className="empty-state" style={{ marginTop: "40px", textAlign: "center", color: "#6b7280" }}>
                                Start a new conversation to ask your study question.
                            </div>
                        ) : (
                            messages.map((message) => (
                                <div
                                    key={message.id}
                                    className="message"
                                    style={{
                                        display: "flex",
                                        gap: "12px",
                                        alignSelf: message.sender === "user" ? "flex-end" : "flex-start",
                                        maxWidth: "80%",
                                    }}
                                >
                                    <div className="message-icon" style={{ width: "32px", height: "32px", borderRadius: "50%", display: "grid", placeItems: "center", background: message.sender === "ai" ? "#dbeafe" : "#e5e7eb" }}>
                                        {message.sender === "ai" ? "🤖" : "👤"}
                                    </div>

                                    <div className="message-content" style={{ background: message.sender === "user" ? "#2563eb" : "#f3f4f6", color: message.sender === "user" ? "white" : "#111827", borderRadius: "12px", padding: "10px 12px", whiteSpace: "pre-wrap" }}>
                                        <strong style={{ display: "block", marginBottom: "4px" }}>
                                            {message.sender === "ai" ? "AI Assistant" : "You"}
                                        </strong>
                                        <p style={{ margin: 0 }}>{message.text}</p>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {error && (
                        <div className="auth-error" style={{ marginTop: "12px" }}>
                            {error}
                        </div>
                    )}

                    <form className="chat-input" onSubmit={sendMessage} style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            placeholder="Ask your question..."
                            style={{ flex: 1 }}
    
                        />

                        <button type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Send ➤"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default AIAssistant;