import { useEffect, useState } from "react";
import api from "../services/api";

function Settings({ user, onLogout }) {
    const [profile, setProfile] = useState({ name: "", email: "" });
    const [appearance, setAppearance] = useState("system");
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setProfile({
                name: user.name || "",
                email: user.email || "",
            });
        }
    }, [user]);

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();
        setStatus({ type: "", message: "" });

        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            setStatus({ type: "error", message: "Please complete all password fields." });
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setStatus({ type: "error", message: "New password must be at least 6 characters." });
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setStatus({ type: "error", message: "New passwords do not match." });
            return;
        }

        try {
            setLoading(true);
            await api.put("/api/auth/change-password", {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });

            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setStatus({ type: "success", message: "Password updated successfully." });
        } catch (error) {
            setStatus({ type: "error", message: error.message || "Unable to update password." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <div className="section-header">
                <h1>⚙️ Settings</h1>
                <p>Manage your account preferences and security.</p>
            </div>

            <div className="settings-layout">
                <div className="settings-card">
                    <h2>Profile</h2>
                    <div className="settings-row">
                        <label>Display name</label>
                        <input value={profile.name} readOnly />
                    </div>
                    <div className="settings-row">
                        <label>Email</label>
                        <input value={profile.email} readOnly />
                    </div>
                    <div className="settings-meta">
                        <span>Account ID</span>
                        <strong>{user?.id || "—"}</strong>
                    </div>
                </div>

                <div className="settings-card">
                    <h2>Password</h2>
                    <form onSubmit={handlePasswordSubmit} className="settings-form">
                        <div className="settings-row">
                            <label>Current password</label>
                            <div className="password-field">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={passwordForm.currentPassword}
                                    onChange={(event) => setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
                                    placeholder="Enter current password"
                                />
                                <button type="button" onClick={() => setShowCurrentPassword((value) => !value)}>
                                    {showCurrentPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <div className="settings-row">
                            <label>New password</label>
                            <div className="password-field">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={passwordForm.newPassword}
                                    onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                                    placeholder="Enter new password"
                                />
                                <button type="button" onClick={() => setShowNewPassword((value) => !value)}>
                                    {showNewPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <div className="settings-row">
                            <label>Confirm password</label>
                            <div className="password-field">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={passwordForm.confirmPassword}
                                    onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                                    placeholder="Confirm new password"
                                />
                                <button type="button" onClick={() => setShowConfirmPassword((value) => !value)}>
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {status.message && (
                            <div className={status.type === "success" ? "auth-success" : "auth-error"}>
                                {status.message}
                            </div>
                        )}

                        <button className="cta-button" type="submit" disabled={loading}>
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                </div>

                <div className="settings-card">
                    <h2>Appearance</h2>
                    <div className="settings-row">
                        <label htmlFor="appearance">Theme</label>
                        <select
                            id="appearance"
                            value={appearance}
                            onChange={(event) => setAppearance(event.target.value)}
                        >
                            <option value="light">Light mode</option>
                            <option value="dark">Dark mode</option>
                            <option value="system">System default</option>
                        </select>
                    </div>

                    <div className="settings-row">
                        <label>Notifications</label>
                        <div className="toggle-row">
                            <span>Email reminders</span>
                            <input type="checkbox" defaultChecked />
                        </div>
                        <div className="toggle-row">
                            <span>Weekly study summary</span>
                            <input type="checkbox" defaultChecked />
                        </div>
                    </div>
                </div>

                <div className="settings-card danger-card">
                    <h2>Account</h2>
                    <p>Sign out of your current session and return to the login screen.</p>
                    <button className="secondary-button" type="button" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Settings;
