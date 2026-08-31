import { useEffect, useState } from "react";

import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";

import Dashboard from "./Components/Dashboard";
import AIAssistant from "./Components/AIAssistant";
import NotesGenerator from "./Components/NotesGenerator";
import QuizGenerator from "./Components/QuizGenerator";
import StudyPlanner from "./Components/StudyPlanner";
import Resources from "./Components/Resources";
import Progress from "./Components/Progress";
import Settings from "./Components/Settings";

import Login from "./Components/Login";
import Register from "./Components/Register";

import "./App.css";

function App() {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [showRegister, setShowRegister] = useState(false);
    const [activePage, setActivePage] = useState("dashboard");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            localStorage.removeItem("user");
            setUser(null);
            setIsAuthenticated(false);
            setIsCheckingAuth(false);
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await fetch("/api/auth/me", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("Invalid token");
                }

                const data = await response.json();

                setUser(data.user);
                setIsAuthenticated(true);
            } catch (error) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setIsCheckingAuth(false);
            }
        };

        verifyToken();
    }, []);

    const handleLogin = (loggedInUser) => {
        setUser(loggedInUser);
        setIsAuthenticated(true);
        setActivePage("dashboard");
        setShowRegister(false);
    };

    const handleRegister = () => {
        setShowRegister(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        setUser(null);
        setIsAuthenticated(false);
        setActivePage("dashboard");
        setShowRegister(false);
    };

    if (isCheckingAuth) {
        return (
            <div className="auth-page">
                <div className="auth-card">
                    <div className="auth-logo">🤖</div>

                    <h1>AI Student Assistant</h1>

                    <h2>Checking your session...</h2>

                    <p>
                        Please wait while we verify your account.
                    </p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated && showRegister) {
        return (
            <Register
                onRegister={handleRegister}
                onLoginClick={() => setShowRegister(false)}
            />
        );
    }

    if (!isAuthenticated) {
        return (
            <Login
                onLogin={handleLogin}
                onRegisterClick={() => setShowRegister(true)}
            />
        );
    }

    const renderPage = () => {
        switch (activePage) {
            case "dashboard":
                return (
                    <Dashboard
                        user={user}
                        setActivePage={setActivePage}
                    />
                );

            case "assistant":
                return <AIAssistant />;

            case "notes":
                return <NotesGenerator />;

            case "quiz":
                return <QuizGenerator />;

            case "planner":
                return <StudyPlanner />;

            case "resources":
                return <Resources />;

            case "progress":
                return <Progress />;

            case "settings":
                return (
                    <Settings
                        user={user}
                        onLogout={handleLogout}
                    />
                );

            default:
                return (
                    <Dashboard
                        user={user}
                        setActivePage={setActivePage}
                    />
                );
        }
    };

    return (
        <>
            <Header user={user} />

            <div className="app-container">
                <Sidebar
                    activePage={activePage}
                    setActivePage={setActivePage}
                    onLogout={handleLogout}
                />

                <main className="main-content">
                    {renderPage()}
                </main>
            </div>
        </>
    );
}

export default App;