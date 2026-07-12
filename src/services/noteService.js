const noteRepository = require('../repositories/noteRepositories'); 
const Note = require('../models/note'); 

const getAllNotes = async () => {
    return await noteRepository.readAll();
};

const createNote = async (noteData) => {
    const notes = await noteRepository.readAll();
    const newNote = new Note(noteData);
    notes.push(newNote);
    await noteRepository.writeAll(notes);
    return newNote;
};

const updateNote = async (id, updatedFields) => {
    const notes = await noteRepository.readAll();
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) return null;

    notes[index] = { ...notes[index], ...updatedFields };
    await noteRepository.writeAll(notes);
    return notes[index];
};

const deleteNote = async (id) => {
    let notes = await noteRepository.readAll();
    const exists = notes.some(n => n.id === id);
    if (!exists) return false;

    notes = notes.filter(n => n.id !== id);
    await noteRepository.writeAll(notes);
    return true;
};

module.exports = { getAllNotes, createNote, updateNote, deleteNote };