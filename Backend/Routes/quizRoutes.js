const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();

const buildQuiz = (topic, difficulty, numberOfQuestions) => {
    const questionCount = Math.min(Math.max(Number(numberOfQuestions) || 5, 1), 15);
    const level = difficulty || "medium";

    const templates = [
        {
            question: `What is the main purpose of ${topic}?`,
            options: [
                `To understand the core concept behind ${topic}`,
                `To avoid writing code`,
                `To replace all other subjects`,
                `To memorize without practice`,
            ],
            answer: 0,
            explanation: `${topic} is best understood by learning its core concepts and applying them through examples and practice.`,
        },
        {
            question: `Which study method is most effective for learning ${topic}?`,
            options: [
                "Practice with examples and revision",
                "Reading only once without recall",
                "Skipping difficult concepts",
                "Memorizing without context",
            ],
            answer: 0,
            explanation: `The most effective approach is to learn the idea, try examples, and revisit the topic regularly to strengthen understanding.`,
        },
        {
            question: `How should a student approach ${topic} at a ${level} level?`,
            options: [
                "Break it into concepts, examples, and practice",
                "Ignore the fundamentals",
                "Only focus on final answers",
                "Study without notes",
            ],
            answer: 0,
            explanation: `Strong learning comes from combining concepts, clear examples, and review instead of rushing through the material.`,
        },
        {
            question: `Why is revision important when learning ${topic}?`,
            options: [
                "It helps strengthen memory and understanding",
                "It makes the subject disappear",
                "It increases confusion",
                "It removes the need to practice",
            ],
            answer: 0,
            explanation: `Regular revision helps you retain ideas and recall them accurately during exams or projects.`,
        },
        {
            question: `Which of these is the best practical strategy for ${topic}?`,
            options: [
                "Combine theory, examples, and exercises",
                "Avoid practice questions",
                "Only read notes once",
                "Memorize without understanding",
            ],
            answer: 0,
            explanation: `Practical learning ensures you understand the concept deeply and can apply it in different situations.`,
        },
    ];

    const finalQuestions = [];

    for (let i = 0; i < questionCount; i += 1) {
        const template = templates[i % templates.length];
        finalQuestions.push({
            question: template.question,
            options: template.options,
            answer: template.answer,
            explanation: template.explanation,
        });
    }

    return finalQuestions;
};

router.post("/generate", authMiddleware, async (req, res) => {
    try {
        const { topic, difficulty, numberOfQuestions } = req.body;

        if (!topic || !String(topic).trim()) {
            return res.status(400).json({ message: "Topic is required." });
        }

        const safeTopic = String(topic).trim();
        const questions = buildQuiz(safeTopic, difficulty, numberOfQuestions);

        return res.status(200).json({
            questions,
        });
    } catch (error) {
        console.error("Generate quiz error:", error);
        return res.status(500).json({
            message: "Failed to generate quiz",
            error: error.message,
        });
    }
});

module.exports = router;
