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

// 1. Mengambil semua catatan dari MySQL
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

// 2. Menambah catatan baru dengan auto-fallback ID jika frontend tidak mengirimkannya
const create = async (note) => {
    const finalId = note.id || Date.now(); 
    const { title, content, color, isPinned, isChecklist, label, isArchived, reminderDate, isTrashed } = note;
    
    await pool.query(
        'INSERT INTO notes (id, title, content, color, isPinned, isChecklist, label, isArchived, reminderDate, isTrashed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
            finalId, title, content, color, 
            isPinned ? 1 : 0, isChecklist ? 1 : 0, 
            label, isArchived ? 1 : 0, reminderDate, isTrashed ? 1 : 0
        ]
    );
    return { ...note, id: finalId };
};

// 3. Mengubah catatan berdasarkan data yang dikirim frontend
const update = async (id, updatedFields) => {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updatedFields)) {
        fields.push(`${key} = ?`);
        if (typeof value === 'boolean') {
            values.push(value ? 1 : 0);
        } else {
            values.push(value);
        }
    }

    if (fields.length === 0) return;

    values.push(id);
    await pool.query(`UPDATE notes SET ${fields.join(', ')} WHERE id = ?`, values);
    return { id, ...updatedFields };
};

// 4. Menghapus catatan berdasarkan ID
const deleteNote = async (id) => {
    await pool.query('DELETE FROM notes WHERE id = ?', [id]);
    return { id };
};

// 5. Fungsi Pencarian Catatan
const searchNotes = async (keyword) => {
    const [rows] = await pool.query(
        'SELECT * FROM notes WHERE (title LIKE ? OR content LIKE ?) AND isTrashed = 0',
        [`%${keyword}%`, `%${keyword}%`]
    );
    return rows.map(row => ({
        ...row,
        isPinned: !!row.isPinned,
        isChecklist: !!row.isChecklist,
        isArchived: !!row.isArchived,
        isTrashed: !!row.isTrashed
    }));
};

// 6. Fungsi writeAll (cadangan)
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

module.exports = { 
    readAll, 
    writeAll, 
    create, 
    update, 
    delete: deleteNote,
    searchNotes
};