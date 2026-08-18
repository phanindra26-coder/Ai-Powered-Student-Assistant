import { useState } from "react";

function Register({ onRegister, onShowLogin }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        setMessage("");

        if (!name || !email || !password) {
            setMessage("Please fill in all fields.");
            return;
        }

        if (password.length < 6) {
            setMessage("Password must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Registration failed.");
                return;
            }

            setMessage("Registration successful!");

            // Tell App.jsx that registration was successful
            if (onRegister) {
                onRegister(data.user);
            }

        } catch (error) {
            console.error("Registration error:", error);

            setMessage(
                "Cannot connect to server. Make sure the backend is running."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logo}>🤖</div>

                <h1 style={styles.title}>Create Account</h1>

                <p style={styles.subtitle}>
                    Join AI Student Assistant
                </p>

                <form onSubmit={handleRegister}>
                    <label style={styles.label}>Full Name</label>

                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={styles.input}
                    />

                    <label style={styles.label}>Email</label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                    />

                    <label style={styles.label}>Password</label>

                    <input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={styles.button}
                    >
                        {loading
                            ? "Creating account..."
                            : "Create Account"}
                    </button>
                </form>

                {message && (
                    <p style={styles.message}>{message}</p>
                )}

                <p style={styles.bottomText}>
                    Already have an account?
                </p>

                <button
                    type="button"
                    onClick={onShowLogin}
                    style={styles.loginButton}
                >
                    Login
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f6fb",
        padding: "20px",
    },

    card: {
        width: "100%",
        maxWidth: "420px",
        background: "#ffffff",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        textAlign: "center",
    },

    logo: {
        fontSize: "48px",
        marginBottom: "10px",
    },

    title: {
        margin: "0",
        color: "#1e293b",
        fontSize: "28px",
    },

    subtitle: {
        color: "#64748b",
        marginBottom: "30px",
    },

    label: {
        display: "block",
        textAlign: "left",
        marginBottom: "7px",
        marginTop: "16px",
        fontWeight: "600",
        color: "#334155",
    },

    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "13px",
        border: "1px solid #cbd5e1",
        borderRadius: "8px",
        fontSize: "15px",
        outline: "none",
    },

    button: {
        width: "100%",
        marginTop: "25px",
        padding: "13px",
        border: "none",
        borderRadius: "8px",
        background: "#2563eb",
        color: "#ffffff",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
    },

    message: {
        marginTop: "15px",
        color: "#16a34a",
        fontWeight: "500",
    },

    bottomText: {
        marginTop: "25px",
        marginBottom: "8px",
        color: "#64748b",
    },

    loginButton: {
        border: "none",
        background: "transparent",
        color: "#2563eb",
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "15px",
    },
};

export default Register;