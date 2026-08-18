function Dashboard({ user, setActivePage }) {
    const userName = user?.name || "Student";

    return (
        <section>

            {/* Welcome Section */}
            <div className="welcome">
                <h1>
                    Welcome back, {userName}! 👋
                </h1>

                <p>
                    What would you like to learn today?
                </p>
            </div>


            {/* Quick Actions */}
            <div className="quick-actions">

                <button
                    onClick={() => setActivePage("assistant")}
                >
                    🤖 Ask AI
                </button>


                <button
                    onClick={() => setActivePage("notes")}
                >
                    📝 Generate Notes
                </button>


                <button
                    onClick={() => setActivePage("quiz")}
                >
                    ✏️ Generate Quiz
                </button>


                <button
                    onClick={() => setActivePage("planner")}
                >
                    📅 Study Plan
                </button>

            </div>


            {/* Statistics */}
            <div className="stats">

                <StatCard
                    icon="📚"
                    number="12"
                    title="Topics Completed"
                />

                <StatCard
                    icon="📝"
                    number="28"
                    title="Notes Created"
                />

                <StatCard
                    icon="✏️"
                    number="15"
                    title="Quizzes Completed"
                />

                <StatCard
                    icon="⏱️"
                    number="24h"
                    title="Study Time"
                />

            </div>


            {/* Dashboard Grid */}
            <div className="dashboard-grid">

                {/* Recent Activity */}
                <div className="card">

                    <h2>
                        Recent Activity
                    </h2>


                    <div className="activity">

                        <p>
                            🤖 Asked AI about
                            <strong> Java OOP</strong>
                        </p>

                        <span>
                            2 hours ago
                        </span>

                    </div>


                    <div className="activity">

                        <p>
                            📝 Generated notes for
                            <strong> DBMS</strong>
                        </p>

                        <span>
                            Yesterday
                        </span>

                    </div>


                    <div className="activity">

                        <p>
                            ✏️ Completed
                            <strong> Python Quiz</strong>
                        </p>

                        <span>
                            2 days ago
                        </span>

                    </div>

                </div>


                {/* Study Progress */}
                <div className="card">

                    <h2>
                        Study Progress
                    </h2>


                    <ProgressBar
                        name="Java"
                        percentage="80"
                    />


                    <ProgressBar
                        name="DBMS"
                        percentage="65"
                    />


                    <ProgressBar
                        name="Python"
                        percentage="75"
                    />


                    <ProgressBar
                        name="Computer Networks"
                        percentage="50"
                    />

                </div>

            </div>

        </section>
    );
}


/* ---------------------------------
   Statistics Card
---------------------------------- */

function StatCard({
    icon,
    number,
    title
}) {
    return (
        <div className="stat-card">

            <div className="stat-icon">
                {icon}
            </div>

            <div>

                <h3>
                    {number}
                </h3>

                <p>
                    {title}
                </p>

            </div>

        </div>
    );
}


/* ---------------------------------
   Progress Bar
---------------------------------- */

function ProgressBar({
    name,
    percentage
}) {
    return (
        <div className="progress-item">

            <div className="progress-info">

                <span>
                    {name}
                </span>

                <span>
                    {percentage}%
                </span>

            </div>


            <div className="progress-bar">

                <div
                    className="progress"
                    style={{
                        width: `${percentage}%`
                    }}
                />

            </div>

        </div>
    );
}


export default Dashboard;