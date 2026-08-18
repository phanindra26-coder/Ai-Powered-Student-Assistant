import { useState } from "react";

function Login({ onLogin, onRegisterClick }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Please enter email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/login`,
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
                setError(data.message || "Login failed.");
                return;
            }

            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            }

            onLogin(data.user);
        } catch (error) {
            console.error("Login error:", error);
            setError("Unable to connect to server. Please make sure the backend is running.");
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
                    <h1>Welcome Back</h1>
                    <p>Login to continue your learning journey.</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleLogin} className="auth-form">
                    <label htmlFor="login-email">Email</label>
                    <input
                        id="login-email"
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                    />

                    <label htmlFor="login-password">Password</label>
                    <div className="password-wrapper">
                        <input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                        <button type="button" className="password-toggle" onClick={() => setShowPassword((prev) => !prev)}>
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <div className="auth-row">
                        <button type="button" className="link-button">Forgot password?</button>
                    </div>

                    <button type="submit" className="primary-button" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="auth-switch">
                    <span>Don’t have an account?</span>
                    <button type="button" onClick={onRegisterClick}>
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;