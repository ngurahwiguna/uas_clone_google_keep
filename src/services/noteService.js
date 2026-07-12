const noteRepository = require('../repositories/noteRepositories');

const noteService = {
    getAllNotes: async () => {
        return await noteRepository.readAll();
    },

    createNote: async (noteData) => {
        return await noteRepository.create(noteData);
    },

    updateNote: async (id, updatedFields) => {
        return await noteRepository.update(id, updatedFields);
    },

    deleteNote: async (id) => {
        return await noteRepository.delete(id);
    },

    searchNotes: async (keyword) => {
        return await noteRepository.searchNotes(keyword);
    }
};

module.exports = noteService;