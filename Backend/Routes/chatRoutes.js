const express = require("express");
const db = require("../db");
const authMiddleware = require("../Middleware/authMiddleware");
const { generateAiReply } = require("../services/aiService");

const router = express.Router();

const createSessionTitle = (message) => {
    const cleaned = String(message || "").trim();

    if (!cleaned) {
        return "New Chat";
    }

    const short = cleaned.replace(/\s+/g, " ").slice(0, 40);
    return short.length < cleaned.length ? `${short}...` : short;
};

router.post("/sessions", authMiddleware, async (req, res) => {
    try {
        const { title } = req.body;
        const userId = req.user.id;

        const sessionTitle = title?.trim() || "New Chat";

        const [result] = await db.query(
            "INSERT INTO chat_sessions (user_id, title) VALUES (?, ?)",
            [userId, sessionTitle]
        );

        return res.status(201).json({
            session: {
                id: result.insertId,
                user_id: userId,
                title: sessionTitle,
            }
        });
    } catch (error) {
        console.error("Create chat session error:", error);
        return res.status(500).json({
            message: "Failed to create chat session",
            error: error.message
        });
    }
});

router.get("/sessions", authMiddleware, async (req, res) => {
    try {
        const [sessions] = await db.query(
            "SELECT id, user_id, title, created_at, updated_at FROM chat_sessions WHERE user_id = ? ORDER BY updated_at DESC",
            [req.user.id]
        );

        return res.status(200).json({ sessions });
    } catch (error) {
        console.error("Get sessions error:", error);
        return res.status(500).json({
            message: "Failed to fetch chat sessions",
            error: error.message
        });
    }
});

router.get("/sessions/:id", authMiddleware, async (req, res) => {
    try {
        const [sessions] = await db.query(
            "SELECT id, user_id, title, created_at, updated_at FROM chat_sessions WHERE id = ?",
            [req.params.id]
        );

        if (sessions.length === 0) {
            return res.status(404).json({ message: "Chat session not found" });
        }

        if (sessions[0].user_id !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized. You can only access your own chats."
            });
        }

        const [messages] = await db.query(
            "SELECT id, session_id, role, message, created_at FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC",
            [req.params.id]
        );

        return res.status(200).json({
            session: sessions[0],
            messages,
        });
    } catch (error) {
        console.error("Get session details error:", error);
        return res.status(500).json({
            message: "Failed to fetch chat session",
            error: error.message
        });
    }
});

router.post("/sessions/:id/messages", authMiddleware, async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !String(message).trim()) {
            return res.status(400).json({ message: "Message is required." });
        }

        const [sessions] = await db.query(
            "SELECT id, user_id, title FROM chat_sessions WHERE id = ?",
            [req.params.id]
        );

        if (sessions.length === 0) {
            return res.status(404).json({ message: "Chat session not found" });
        }

        if (sessions[0].user_id !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized. You can only access your own chats."
            });
        }

        const trimmedMessage = String(message).trim();
        const reply = await generateAiReply(trimmedMessage);

        await db.query(
            "INSERT INTO chat_messages (session_id, role, message) VALUES (?, 'user', ?)",
            [req.params.id, trimmedMessage]
        );

        await db.query(
            "INSERT INTO chat_messages (session_id, role, message) VALUES (?, 'assistant', ?)",
            [req.params.id, reply]
        );

        await db.query(
            "UPDATE chat_sessions SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            [createSessionTitle(trimmedMessage), req.params.id]
        );

        return res.status(201).json({
            reply,
            message: trimmedMessage,
            sessionId: Number(req.params.id),
        });
    } catch (error) {
        console.error("Save session message error:", error);
        return res.status(500).json({
            message: "Failed to save chat message",
            error: error.message
        });
    }
});

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !String(message).trim()) {
            return res.status(400).json({
                message: "Message is required."
            });
        }

        if (String(message).trim().length > 2000) {
            return res.status(400).json({
                message: "Message is too long. Please keep it under 2000 characters."
            });
        }

        const reply = await generateAiReply(String(message).trim());

        const [result] = await db.query(
            "INSERT INTO chat_history (user_id, question, answer) VALUES (?, ?, ?)",
            [req.user.id, String(message).trim(), reply]
        );

        return res.status(200).json({
            reply,
            chat: {
                id: result.insertId,
                question: String(message).trim(),
                answer: reply,
            }
        });
    } catch (error) {
        console.error("Chat AI error:", error);
        return res.status(500).json({
            message: "Failed to generate AI response",
            error: error.message
        });
    }
});

router.get("/history", authMiddleware, async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, question, answer, created_at FROM chat_history WHERE user_id = ? ORDER BY created_at DESC",
            [req.user.id]
        );

        return res.status(200).json({ chats: rows });
    } catch (error) {
        console.error("Get chat history error:", error);
        return res.status(500).json({
            message: "Failed to retrieve chat history",
            error: error.message
        });
    }
});

router.delete("/sessions/:id", authMiddleware, async (req, res) => {
    try {
        const [sessions] = await db.query(
            "SELECT id, user_id FROM chat_sessions WHERE id = ?",
            [req.params.id]
        );

        if (sessions.length === 0) {
            return res.status(404).json({ message: "Chat session not found" });
        }

        if (sessions[0].user_id !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized. You can only delete your own chats."
            });
        }

        await db.query("DELETE FROM chat_sessions WHERE id = ?", [req.params.id]);

        return res.status(200).json({
            message: "Chat session deleted successfully"
        });
    } catch (error) {
        console.error("Delete session error:", error);
        return res.status(500).json({
            message: "Failed to delete chat session",
            error: error.message
        });
    }
});

module.exports = router;
