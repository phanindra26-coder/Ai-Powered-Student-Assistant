const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const authRoutes = require("./Routes/authRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const notesRoutes = require("./Routes/notesRoutes");
const quizRoutes = require("./Routes/quizRoutes");
const plannerRoutes = require("./Routes/plannerRoutes");
const progressRoutes = require("./Routes/progressRoutes");

const app = express();

app.use(
    cors({
        origin: true,
        credentials: true
    })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const initializeDatabase = async () => {
    const queries = [
        `CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE IF NOT EXISTS chat_sessions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_chat_sessions_user_id (user_id)
        )`,

        `CREATE TABLE IF NOT EXISTS chat_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            session_id INT NOT NULL,
            role ENUM('user','assistant') NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE,
            INDEX idx_chat_messages_session_id (session_id)
        )`,

        `CREATE TABLE IF NOT EXISTS chat_history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_chat_history_user_id (user_id)
        )`,

        `CREATE TABLE IF NOT EXISTS notes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            subject VARCHAR(255),
            content LONGTEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_notes_user_id (user_id)
        )`,

        `CREATE TABLE IF NOT EXISTS study_plans (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            subject VARCHAR(255) NOT NULL,
            task VARCHAR(255) NOT NULL,
            description TEXT,
            date DATE,
            start_time TIME,
            end_time TIME,
            priority VARCHAR(50) DEFAULT 'medium',
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_study_plans_user_id (user_id)
        )`,

        `CREATE TABLE IF NOT EXISTS user_progress (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            subject VARCHAR(255) NOT NULL,
            completed_tasks INT DEFAULT 0,
            quiz_attempts INT DEFAULT 0,
            quiz_score DECIMAL(5,2) DEFAULT 0,
            study_minutes INT DEFAULT 0,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_user_progress_user_id (user_id)
        )`
    ];

    for (const query of queries) {
        await db.query(query);
    }

    console.log("Database tables initialized successfully.");
};

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/planner", plannerRoutes);
app.use("/api/progress", progressRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "AI Student Assistant Backend is running!",
        status: "success"
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Backend API is healthy"
    });
});

app.use((err, req, res, next) => {
    console.error("Server error:", err);

    res.status(500).json({
        message: "Internal Server Error",
        error: process.env.NODE_ENV === "production"
            ? "Something went wrong"
            : err.message
    });
});

app.use((req, res) => {
    res.status(404).json({
        message: "API endpoint not found"
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await initializeDatabase();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`API: http://localhost:${PORT}`);
            console.log(`Health: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();