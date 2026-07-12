const noteRepository = require('../repositories/noteRepositories');

const noteService = {
    // 1. Mengambil semua catatan dari MySQL
    getAllNotes: async () => {
        return await noteRepository.readAll();
    },

    // 2. Menambah catatan baru langsung ke MySQL
    createNote: async (noteData) => {
        // Kita langsung lempar payload data dari frontend ke repositori database
        return await noteRepository.create(noteData);
    },

    // 3. Mengubah catatan berdasarkan ID di MySQL
    updateNote: async (id, updatedFields) => {
        return await noteRepository.update(id, updatedFields);
    },

    // 4. Menghapus catatan berdasarkan ID di MySQL
    deleteNote: async (id) => {
        return await noteRepository.delete(id);
    }
};

module.exports = noteService;