function Sidebar({
    activePage,
    setActivePage,
    onLogout
}) {

    const menuItems = [
        {
            id: "dashboard",
            icon: "🏠",
            name: "Dashboard"
        },
        {
            id: "assistant",
            icon: "🤖",
            name: "AI Assistant"
        },
        {
            id: "notes",
            icon: "📝",
            name: "Notes Generator"
        },
        {
            id: "quiz",
            icon: "❓",
            name: "Quiz Generator"
        },
        {
            id: "planner",
            icon: "📅",
            name: "Study Planner"
        },
        {
            id: "resources",
            icon: "📚",
            name: "Resources"
        },
        {
            id: "progress",
            icon: "📊",
            name: "My Progress"
        }
    ];

    return (
        <aside className="sidebar">

            <nav>

                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={
                            activePage === item.id
                                ? "nav-item active"
                                : "nav-item"
                        }
                        onClick={() => setActivePage(item.id)}
                    >
                        <span>{item.icon}</span>
                        <span>{item.name}</span>
                    </button>
                ))}

            </nav>

            <div className="sidebar-bottom">

                <button
                    className={activePage === "settings" ? "nav-item active" : "nav-item"}
                    onClick={() => setActivePage("settings")}
                >
                    <span>⚙️</span>
                    <span>Settings</span>
                </button>

                <button
                    className="nav-item"
                    onClick={onLogout}
                >
                    <span>🚪</span>
                    <span>Logout</span>
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;