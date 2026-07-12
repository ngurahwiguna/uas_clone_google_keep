const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'wiguna2006', 
    database: 'keep_clone_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const readAll = async () => {
    const [rows] = await pool.query('SELECT * FROM notes');

    return rows.map(row => ({
        ...row,
        isPinned: !!row.isPinned,
        isChecklist: !!row.isChecklist,
        isArchived: !!row.isArchived,
        isTrashed: !!row.isTrashed
    }));
};

const writeAll = async (notes) => {
    await pool.query('TRUNCATE TABLE notes');
    if (notes.length === 0) return;

    const values = notes.map(n => [
        n.id, n.title, n.content, n.color,
        n.isPinned ? 1 : 0, n.isChecklist ? 1 : 0,
        n.label, n.isArchived ? 1 : 0, n.reminderDate, n.isTrashed ? 1 : 0
    ]);

    await pool.query(
        'INSERT INTO notes (id, title, content, color, isPinned, isChecklist, label, isArchived, reminderDate, isTrashed) VALUES ?',
        [values]
    );
};

module.exports = { readAll, writeAll };