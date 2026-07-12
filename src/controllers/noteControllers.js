const noteService = require('../services/noteService');

const getAllNotes = async (req, res) => {
    try {
        const notes = await noteService.getAllNotes();
        res.json(notes);
    } catch (error) {
        console.error("Error di getAllNotes:", error);
        res.status(500).json({ message: "Gagal mengambil data catatan" });
    }
};

const createNote = async (req, res) => {
    try {
        const { title, content, color, isPinned, isChecklist, label, isArchived, reminderDate, isTrashed } = req.body;
        
        const newNote = await noteService.createNote({ 
            title, 
            content, 
            color: color || '#ffffff', // Default putih jika tidak ada warna
            isPinned: isPinned || 0, 
            isChecklist: isChecklist || 0, 
            label: label || null,
            isArchived: isArchived || 0, 
            reminderDate: reminderDate || null,
            isTrashed: isTrashed || 0
        });
        
        res.status(201).json(newNote);
    } catch (error) {
        console.error("Error di createNote:", error);
        res.status(500).json({ message: "Gagal menyimpan catatan baru" });
    }
};

const updateNote = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { title, content, color, isPinned, isChecklist, label, isArchived, reminderDate, isTrashed } = req.body;
        
        const updatedNote = await noteService.updateNote(id, { 
            title, 
            content, 
            color, 
            isPinned, 
            isChecklist, 
            label, 
            isArchived, 
            reminderDate, 
            isTrashed 
        });
        
        if (!updatedNote) return res.status(404).json({ message: "Catatan tidak ditemukan" });
        res.json(updatedNote);
    } catch (error) {
        console.error("Error di updateNote:", error);
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
        console.error("Error di deleteNote:", error);
        res.status(500).json({ message: "Gagal menghapus catatan" });
    }
};

const searchNotes = async (req, res) => {
    try {
        const { query } = req.query;
        const notes = await noteService.searchNotes(query);
        res.json(notes);
    } catch (error) {
        console.error("Error di searchNotes:", error);
        res.status(500).json({ message: "Gagal mencari catatan" });
    }
};

module.exports = { getAllNotes, createNote, updateNote, deleteNote, searchNotes };