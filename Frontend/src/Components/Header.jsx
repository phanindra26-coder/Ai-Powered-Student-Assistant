function Header({ user }) {
    const displayName = user?.name || "Student";
    const profileLetter = displayName.charAt(0).toUpperCase();

    return (
        <header className="header">
            <div className="logo">
                <span>🤖</span>
                <h2>AI Student Assistant</h2>
            </div>

            <div className="user-section">
                <span className="notification">🔔</span>
                <span className="user-name">{displayName}</span>
                <div className="profile-icon">{profileLetter}</div>
            </div>
        </header>
    );
}

export default Header;