const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "student_assistant.db");
const sqlite = new Database(dbPath);

sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

const db = {
    query(sql, params = []) {
        const trimmed = sql.trim().toUpperCase();

        if (trimmed.startsWith("SELECT")) {
            const rows = sqlite.prepare(sql).all(...params);
            return [rows, []];
        }

        if (trimmed.startsWith("INSERT")) {
            const result = sqlite.prepare(sql).run(...params);
            return [{ insertId: result.lastInsertRowid, affectedRows: result.changes }, []];
        }

        if (trimmed.startsWith("UPDATE") || trimmed.startsWith("DELETE")) {
            const result = sqlite.prepare(sql).run(...params);
            return [{ affectedRows: result.changes }, []];
        }

        if (trimmed.startsWith("CREATE")) {
            sqlite.prepare(sql).run(...params);
            return [[], []];
        }

        sqlite.prepare(sql).run(...params);
        return [[], []];
    },
};

module.exports = db;
