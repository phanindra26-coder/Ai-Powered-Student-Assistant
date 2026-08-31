import { useState } from "react";
import api from "../services/api";

function Register({ onRegister, onLoginClick }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!name || !email || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const data = await api.post("/api/auth/register", { name, email, password });

            setMessage("Registration successful! Please login.");
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

            if (onRegister) {
                onRegister(data.user);
            }
        } catch (error) {
            console.error("Registration error:", error);
            setError(error.message || "Unable to connect to server. Please make sure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-branding">
                    <div className="auth-logo">🤖</div>
                    <span>AI Student Assistant</span>
                </div>

                <div className="auth-header">
                    <h1>Create Your Account</h1>
                    <p>Register to start your learning journey.</p>
                </div>

                {error && <div className="auth-error">{error}</div>}
                {message && <div className="auth-success">{message}</div>}

                <form onSubmit={handleRegister} className="auth-form">
                    <label htmlFor="register-name">Full Name</label>
                    <input
                        id="register-name"
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                    />

                    <label htmlFor="register-email">Email</label>
                    <input
                        id="register-email"
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                    />

                    <label htmlFor="register-password">Password</label>
                    <div className="password-wrapper">
                        <input
                            id="register-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                        <button type="button" className="password-toggle" onClick={() => setShowPassword((prev) => !prev)}>
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <label htmlFor="register-confirm-password">Confirm Password</label>
                    <div className="password-wrapper">
                        <input
                            id="register-confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                        <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword((prev) => !prev)}>
                            {showConfirmPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <button type="submit" className="primary-button" disabled={loading}>
                        {loading ? "Creating Account..." : "Register"}
                    </button>
                </form>

                <div className="auth-switch">
                    <span>Already have an account?</span>
                    <button type="button" onClick={onLoginClick}>
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;