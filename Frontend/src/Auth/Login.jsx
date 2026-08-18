import { useState } from "react";

function Login({ onLogin, onShowRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setMessage("");

        if (!email || !password) {
            setMessage("Please enter email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Login failed.");
                return;
            }

            // Save user information
            localStorage.setItem("user", JSON.stringify(data.user));

            // Save JWT token if backend sends one
            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            setMessage("Login successful!");

            // Tell App.jsx that login was successful
            if (onLogin) {
                onLogin(data.user);
            }

        } catch (error) {
            console.error("Login error:", error);
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

                <h1 style={styles.title}>AI Student Assistant</h1>

                <p style={styles.subtitle}>
                    Sign in to continue learning
                </p>

                <form onSubmit={handleLogin}>
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
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={styles.button}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {message && (
                    <p style={styles.message}>{message}</p>
                )}

                <p style={styles.bottomText}>
                    Don't have an account?
                </p>

                <button
                    type="button"
                    onClick={onShowRegister}
                    style={styles.registerButton}
                >
                    Create an account
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
        color: "#dc2626",
        fontWeight: "500",
    },

    bottomText: {
        marginTop: "25px",
        marginBottom: "8px",
        color: "#64748b",
    },

    registerButton: {
        border: "none",
        background: "transparent",
        color: "#2563eb",
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "15px",
    },
};

export default Login;