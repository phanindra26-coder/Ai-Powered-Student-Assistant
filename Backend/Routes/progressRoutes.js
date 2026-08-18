const express = require("express");
const db = require("../db");
const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        const [progressData] = await db.query(
            `SELECT * FROM user_progress WHERE user_id = ? ORDER BY updated_at DESC`,
            [req.user.id]
        );

        return res.status(200).json({ progress: progressData });
    } catch (error) {
        console.error("Get progress error:", error);
        return res.status(500).json({
            message: "Failed to fetch progress data",
            error: error.message,
        });
    }
});

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { subject, completed_tasks, quiz_attempts, quiz_score, study_minutes } = req.body;

        if (!subject || !String(subject).trim()) {
            return res.status(400).json({ message: "Subject is required." });
        }

        const safeSubject = String(subject).trim();

        const [result] = await db.query(
            `INSERT INTO user_progress (user_id, subject, completed_tasks, quiz_attempts, quiz_score, study_minutes)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                req.user.id,
                safeSubject,
                Number(completed_tasks || 0),
                Number(quiz_attempts || 0),
                Number(quiz_score || 0),
                Number(study_minutes || 0),
            ]
        );

        return res.status(201).json({
            message: "Progress saved successfully",
            progress: {
                id: result.insertId,
                user_id: req.user.id,
                subject: safeSubject,
                completed_tasks: Number(completed_tasks || 0),
                quiz_attempts: Number(quiz_attempts || 0),
                quiz_score: Number(quiz_score || 0),
                study_minutes: Number(study_minutes || 0),
            },
        });
    } catch (error) {
        console.error("Create progress data error:", error);
        return res.status(500).json({
            message: "Failed to save progress data",
            error: error.message,
        });
    }
});

router.put("/", authMiddleware, async (req, res) => {
    try {
        const { subject, completed_tasks, quiz_attempts, quiz_score, study_minutes } = req.body;

        if (!subject || !String(subject).trim()) {
            return res.status(400).json({ message: "Subject is required." });
        }

        const safeSubject = String(subject).trim();

        const [existing] = await db.query(
            `SELECT * FROM user_progress WHERE user_id = ? AND subject = ?`,
            [req.user.id, safeSubject]
        );

        if (existing.length === 0) {
            return res.status(404).json({ message: "Progress record not found for this subject." });
        }

        const nextCompletedTasks = Number(completed_tasks ?? existing[0].completed_tasks);
        const nextQuizAttempts = Number(quiz_attempts ?? existing[0].quiz_attempts);
        const nextQuizScore = Number(quiz_score ?? existing[0].quiz_score);
        const nextStudyMinutes = Number(study_minutes ?? existing[0].study_minutes);

        await db.query(
            `UPDATE user_progress SET completed_tasks = ?, quiz_attempts = ?, quiz_score = ?, study_minutes = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND subject = ?`,
            [nextCompletedTasks, nextQuizAttempts, nextQuizScore, nextStudyMinutes, req.user.id, safeSubject]
        );

        const [updated] = await db.query(
            `SELECT * FROM user_progress WHERE user_id = ? AND subject = ?`,
            [req.user.id, safeSubject]
        );

        return res.status(200).json({
            message: "Progress updated successfully",
            progress: updated[0],
        });
    } catch (error) {
        console.error("Update progress data error:", error);
        return res.status(500).json({
            message: "Failed to update progress data",
            error: error.message,
        });
    }
});

module.exports = router;
