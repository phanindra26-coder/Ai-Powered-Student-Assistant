const express = require("express");
const db = require("../db");
const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();

const normalizePriority = (value) => {
    const safeValue = String(value || "medium").toLowerCase();
    return ["low", "medium", "high"].includes(safeValue) ? safeValue : "medium";
};

const normalizeStatus = (value) => {
    const safeValue = String(value || "pending").toLowerCase();
    return ["pending", "in-progress", "completed"].includes(safeValue) ? safeValue : "pending";
};

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { subject, task, description, date, start_time, end_time, priority, status } = req.body;

        if (!subject || !String(subject).trim() || !task || !String(task).trim()) {
            return res.status(400).json({
                message: "Subject and task are required.",
            });
        }

        const cleanSubject = String(subject).trim();
        const cleanTask = String(task).trim();
        const cleanDescription = description !== undefined && description !== null ? String(description).trim() : null;

        const [result] = await db.query(
            `INSERT INTO study_plans (user_id, subject, task, description, date, start_time, end_time, priority, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                req.user.id,
                cleanSubject,
                cleanTask,
                cleanDescription,
                date || null,
                start_time || null,
                end_time || null,
                normalizePriority(priority),
                normalizeStatus(status),
            ]
        );

        return res.status(201).json({
            message: "Study plan created successfully",
            plan: {
                id: result.insertId,
                user_id: req.user.id,
                subject: cleanSubject,
                task: cleanTask,
                description: cleanDescription,
                date: date || null,
                start_time: start_time || null,
                end_time: end_time || null,
                priority: normalizePriority(priority),
                status: normalizeStatus(status),
            },
        });
    } catch (error) {
        console.error("Create planner task error:", error);
        return res.status(500).json({
            message: "Failed to create study plan",
            error: error.message,
        });
    }
});

router.get("/", authMiddleware, async (req, res) => {
    try {
        const [plans] = await db.query(
            `SELECT * FROM study_plans WHERE user_id = ? ORDER BY date ASC, start_time ASC, created_at DESC`,
            [req.user.id]
        );

        return res.status(200).json({ plans });
    } catch (error) {
        console.error("Fetch planner tasks error:", error);
        return res.status(500).json({
            message: "Failed to fetch study plans",
            error: error.message,
        });
    }
});

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const [plans] = await db.query(`SELECT * FROM study_plans WHERE id = ?`, [req.params.id]);

        if (plans.length === 0) {
            return res.status(404).json({ message: "Study plan not found" });
        }

        if (plans[0].user_id !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized. You can only update your own tasks.",
            });
        }

        const updateFields = req.body || {};
        const allowedFields = [
            "subject",
            "task",
            "description",
            "date",
            "start_time",
            "end_time",
            "priority",
            "status",
        ];

        const updates = [];
        const values = [];

        allowedFields.forEach((field) => {
            if (updateFields[field] !== undefined) {
                let value = updateFields[field];

                if (field === "subject" || field === "task") {
                    value = String(value).trim();
                    if (!value) {
                        throw new Error(`${field} cannot be empty.`);
                    }
                }

                if (field === "priority") {
                    value = normalizePriority(value);
                }

                if (field === "status") {
                    value = normalizeStatus(value);
                }

                if (field === "description" && value === null) {
                    updates.push(`${field} = ?`);
                    values.push(null);
                    return;
                }

                if (field === "description" && typeof value === "string") {
                    value = value.trim();
                }

                updates.push(`${field} = ?`);
                values.push(value);
            }
        });

        if (updates.length === 0) {
            return res.status(400).json({ message: "No changes provided." });
        }

        values.push(req.params.id);

        await db.query(
            `UPDATE study_plans SET ${updates.join(", ")} WHERE id = ?`,
            values
        );

        const [updatedPlan] = await db.query(
            `SELECT * FROM study_plans WHERE id = ?`,
            [req.params.id]
        );

        return res.status(200).json({
            message: "Study plan updated successfully",
            plan: updatedPlan[0],
        });
    } catch (error) {
        console.error("Update planner task error:", error);
        return res.status(500).json({
            message: error.message || "Failed to update study plan",
            error: error.message,
        });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const [plans] = await db.query(`SELECT * FROM study_plans WHERE id = ?`, [req.params.id]);

        if (plans.length === 0) {
            return res.status(404).json({ message: "Study plan not found" });
        }

        if (plans[0].user_id !== req.user.id) {
            return res.status(403).json({
                message: "Unauthorized. You can only delete your own tasks.",
            });
        }

        await db.query(`DELETE FROM study_plans WHERE id = ?`, [req.params.id]);

        return res.status(200).json({
            message: "Study plan deleted successfully",
        });
    } catch (error) {
        console.error("Delete planner task error:", error);
        return res.status(500).json({
            message: "Failed to delete study plan",
            error: error.message,
        });
    }
});

module.exports = router;
