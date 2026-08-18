const DEFAULT_RESPONSE = `I can help you study more effectively. Please share the topic, the concept you want explained, or the question you're stuck on, and I’ll break it down in a clear, simpler way.`;

const buildFallbackReply = (message) => {
    const cleaned = String(message || "").trim();
    const lower = cleaned.toLowerCase();

    if (!cleaned) {
        return DEFAULT_RESPONSE;
    }

    if (lower.includes("javascript") || lower.includes("js")) {
        return "JavaScript is a programming language that helps make web pages interactive. It is used for events, logic, DOM updates, and dynamic behavior. A good way to learn it is to practice variables, functions, loops, arrays, and objects with small real examples.";
    }

    if (lower.includes("python")) {
        return "Python is a beginner-friendly language used for automation, data analysis, AI, and web development. It is popular because the syntax is easy to read, and it supports many libraries for solving real-world problems.";
    }

    if (lower.includes("dbms") || lower.includes("database") || lower.includes("sql")) {
        return "A database management system stores and organizes data so it can be retrieved, updated, and managed efficiently. Important concepts include tables, keys, normalization, joins, and constraints. Practice writing queries and understanding how data is related across tables.";
    }

    if (lower.includes("react")) {
        return "React is a JavaScript library for building user interfaces. It helps you create reusable components and manage UI updates efficiently. The main ideas are components, props, state, and rendering logic.";
    }

    if (lower.includes("machine learning") || lower.includes("ml") || lower.includes("ai")) {
        return "Machine learning is a method where computers learn patterns from data instead of being explicitly programmed for every task. It is commonly used for predictions, recommendations, and classification. A simple example is predicting student performance based on study habits and quiz scores.";
    }

    if (lower.includes("operating system") || lower.includes("os")) {
        return "An operating system manages the computer's hardware and software resources. It handles processes, memory, storage, and user interaction. Core topics include scheduling, memory management, file systems, and process synchronization.";
    }

    return `Here is a simple explanation: ${cleaned} is a topic that becomes easier when you break it into core concepts, examples, and practice questions. Try to understand the idea, then connect it to a real example so you can remember it more clearly.`;
};

const generateAiReply = async (message) => {
    const trimmedMessage = String(message || "").trim();

    if (!trimmedMessage) {
        return DEFAULT_RESPONSE;
    }

    const apiKey = process.env.AI_API_KEY;
    const model = process.env.AI_MODEL || "gpt-4o-mini";

    if (apiKey) {
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        {
                            role: "user",
                            content: trimmedMessage,
                        },
                    ],
                    temperature: 0.7,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const reply = data?.choices?.[0]?.message?.content?.trim();

                if (reply) {
                    return reply;
                }
            }
        } catch (error) {
            console.error("AI API request failed, using fallback response:", error.message);
        }
    }

    return buildFallbackReply(trimmedMessage);
};

module.exports = {
    generateAiReply,
    buildFallbackReply,
};
