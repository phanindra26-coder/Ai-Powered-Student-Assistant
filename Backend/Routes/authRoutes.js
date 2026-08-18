const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const [users] = await db.query(
            "SELECT id, name, email FROM users WHERE id = ?",
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            user: {
                id: users[0].id,
                name: users[0].name,
                email: users[0].email,
            },
        });
    } catch (error) {
        console.error("Get current user error:", error);
        return res.status(500).json({
            message: "Failed to fetch user information",
            error: error.message,
        });
    }
});

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required",
            });
        }

        const trimmedName = String(name).trim();
        const normalizedEmail = normalizeEmail(email);

        if (!trimmedName || !normalizedEmail || String(password).length < 6) {
            return res.status(400).json({
                message: "Please provide a valid name, email and password with at least 6 characters.",
            });
        }

        const [existingUser] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [normalizedEmail]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                message: "Email already registered",
            });
        }

        const hashedPassword = await bcrypt.hash(String(password), 10);

        const [result] = await db.query(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [trimmedName, normalizedEmail, hashedPassword]
        );

        return res.status(201).json({
            message: "Registration successful",
            user: {
                id: result.insertId,
                name: trimmedName,
                email: normalizedEmail,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            message: "Registration failed",
            error: error.message,
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const normalizedEmail = normalizeEmail(email);

        const [users] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [normalizedEmail]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const user = users[0];
        const passwordMatch = await bcrypt.compare(String(password), user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Login failed",
            error: error.message,
        });
    }
});

router.put("/change-password", authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current password and new password are required.",
            });
        }

        if (String(newPassword).length < 6) {
            return res.status(400).json({
                message: "New password must be at least 6 characters long.",
            });
        }

        const [users] = await db.query(
            "SELECT password FROM users WHERE id = ?",
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const isCurrentPasswordValid = await bcrypt.compare(
            String(currentPassword),
            users[0].password
        );

        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                message: "Current password is incorrect.",
            });
        }

        const hashedPassword = await bcrypt.hash(String(newPassword), 10);

        await db.query("UPDATE users SET password = ? WHERE id = ?", [
            hashedPassword,
            req.user.id,
        ]);

        return res.status(200).json({
            message: "Password updated successfully.",
        });
    } catch (error) {
        console.error("Change password error:", error);
        return res.status(500).json({
            message: "Failed to update password",
            error: error.message,
        });
    }
});

router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const [users] = await db.query(
            "SELECT id, name, email, created_at FROM users WHERE id = ?",
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Protected profile accessed successfully",
            user: users[0],
        });
    } catch (error) {
        console.error("Profile error:", error);

        return res.status(500).json({
            message: "Failed to get profile",
            error: error.message,
        });
    }
});

module.exports = router;