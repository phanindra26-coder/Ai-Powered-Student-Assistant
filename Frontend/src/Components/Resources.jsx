import { useMemo, useState } from "react";

const resources = [
    {
        title: "MDN Web Docs",
        category: "Programming",
        description: "Authoritative documentation for HTML, CSS, JavaScript, and web fundamentals.",
        link: "https://developer.mozilla.org/",
    },
    {
        title: "Python Official Docs",
        category: "Programming",
        description: "Core language reference and tutorials for Python beginners and experienced developers.",
        link: "https://docs.python.org/3/",
    },
    {
        title: "Kaggle Learn",
        category: "Data Science",
        description: "Hands-on courses in data analysis, visualization, machine learning, and Python workflows.",
        link: "https://www.kaggle.com/learn",
    },
    {
        title: "Google AI Education",
        category: "AI / Machine Learning",
        description: "Overview articles and learning paths for AI, ML, and practical responsible AI practices.",
        link: "https://ai.google/education/",
    },
    {
        title: "AWS Skill Builder",
        category: "Cloud",
        description: "Cloud learning materials for AWS services, architecture, and practical hands-on labs.",
        link: "https://skillbuilder.aws/",
    },
    {
        title: "Linux Documentation Project",
        category: "Operating Systems",
        description: "Detailed reference for Linux commands, system administration, and shell usage.",
        link: "https://tldp.org/",
    },
    {
        title: "Cisco Networking Academy",
        category: "Computer Networks",
        description: "Introductory to advanced networking concepts, protocols, and foundational computer networking.",
        link: "https://www.netacad.com/",
    },
    {
        title: "Docker Docs",
        category: "DevOps",
        description: "Official documentation for containerization, orchestration, and modern deployment workflows.",
        link: "https://docs.docker.com/",
    },
    {
        title: "MySQL Documentation",
        category: "DBMS",
        description: "Official MySQL guides on queries, optimization, administration, and relational database concepts.",
        link: "https://dev.mysql.com/doc/",
    },
    {
        title: "Cloudflare Learning",
        category: "Computer Networks",
        description: "Practical lessons on DNS, networking, security, and internet infrastructure basics.",
        link: "https://www.cloudflare.com/learning/",
    },
];

const allCategories = ["All", ...new Set(resources.map((item) => item.category))];

function Resources() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    const filteredResources = useMemo(() => {
        return resources.filter((resource) => {
            const matchesCategory = category === "All" || resource.category === category;
            const matchesSearch = !search ||
                resource.title.toLowerCase().includes(search.toLowerCase()) ||
                resource.description.toLowerCase().includes(search.toLowerCase()) ||
                resource.category.toLowerCase().includes(search.toLowerCase());

            return matchesCategory && matchesSearch;
        });
    }, [search, category]);

    const openResource = (link) => {
        window.open(link, "_blank", "noopener,noreferrer");
    };

    return (
        <section>
            <div className="section-header">
                <h1>📚 Learning Resources</h1>
                <p>Search and explore the best study resources for your subjects.</p>
            </div>

            <div className="resources-toolbar">
                <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search resources..."
                />
                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                    {allCategories.map((item) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>
            </div>

            <div className="resource-grid">
                {filteredResources.length === 0 ? (
                    <div className="empty-state-box full-width">
                        <p>No resources match your search.</p>
                    </div>
                ) : (
                    filteredResources.map((resource) => (
                        <div className="resource-card" key={resource.title}>
                            <div className="resource-top-row">
                                <span className="resource-category">{resource.category}</span>
                            </div>
                            <h3>{resource.title}</h3>
                            <p>{resource.description}</p>
                            <button type="button" onClick={() => openResource(resource.link)}>
                                Open Resource
                            </button>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}

export default Resources;