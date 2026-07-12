const noteService = require('../services/noteService');

const getAllNotes = async (req, res) => {
    try {
        const notes = await noteService.getAllNotes();
        res.json(notes);
    } catch (error) {
        console.error(" Error di getAllNotes:", error); // Menampilkan error di terminal
        res.status(500).json({ message: "Gagal mengambil data catatan" });
    }
};

const createNote = async (req, res) => {
    try {
        const newNote = await noteService.createNote(req.body);
        res.status(201).json(newNote);
    } catch (error) {
        console.error(" Error di createNote:", error); // Menampilkan error di terminal
        res.status(500).json({ message: "Gagal menyimpan catatan baru" });
    }
};

const updateNote = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updatedNote = await noteService.updateNote(id, req.body);
        if (!updatedNote) return res.status(404).json({ message: "Catatan tidak ditemukan" });
        res.json(updatedNote);
    } catch (error) {
        console.error(" Error di updateNote:", error); // Menampilkan error di terminal
        res.status(500).json({ message: "Gagal memperbarui catatan" });
    }
};

const deleteNote = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const isDeleted = await noteService.deleteNote(id);
        if (!isDeleted) return res.status(404).json({ message: "Catatan tidak ditemukan" });
        res.json({ message: "Catatan berhasil dihapus" });
    } catch (error) {
        console.error(" Error di deleteNote:", error); // Menampilkan error di terminal
        res.status(500).json({ message: "Gagal menghapus catatan" });
    }
};

module.exports = { getAllNotes, createNote, updateNote, deleteNote };