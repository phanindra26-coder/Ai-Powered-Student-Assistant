const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const { generateAiReply } = require("../services/aiService");

const router = express.Router();

router.post("/generate", authMiddleware, async (req, res) => {
    try {
        const { topic, level, length } = req.body;

        if (!topic || !String(topic).trim()) {
            return res.status(400).json({ message: "Topic is required." });
        }

        const safeTopic = String(topic).trim();
        const safeLevel = String(level || "college").trim();
        const safeLength = String(length || "medium").trim();

        const prompt = `Create structured study notes on ${safeTopic} for a ${safeLevel} level student. Make the notes ${safeLength} in length, easy to understand, and include headings, key concepts, summary points, and revision tips.`;

        const content = await generateAiReply(prompt);
        const title = `${safeTopic} Notes`;

        return res.status(200).json({
            title,
            content,
        });
    } catch (error) {
        console.error("Generate notes error:", error);
        return res.status(500).json({
            message: "Failed to generate study notes",
            error: error.message,
        });
    }
});

module.exports = router;
