const noteService = require('../src/services/noteService');
const noteRepository = require('../src/repositories/noteRepositories');

jest.mock('../src/repositories/noteRepositories', () => ({
    readAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
}));

describe('🎯 Unit Testing Seluruh Fitur Utama Google Keep Clone', () => {
    
    beforeEach(() => {
        jest.clearAllMocks(); 
    });

    test(' [Fitur Tampil & Search] Harus berhasil mengambil semua catatan dengan atribut Label, Checklist, dan Status Kategori', async () => {
        const mockNotesList = [
            { id: 1, title: 'Tugas Kuliah', content: 'Belajar Unit Testing', label: 'Akademik', checklist: 'Belum', status: 'active', color: '#ffffff' },
            { id: 2, title: 'Beli Kopi', content: 'Espresso 2 shot', label: 'Belanja', checklist: 'Selesai', status: 'archive', color: '#FFF475' }
        ];

        noteRepository.readAll.mockResolvedValue(mockNotesList);

        const result = await noteService.getAllNotes();

        expect(noteRepository.readAll).toHaveBeenCalledTimes(1);
        expect(result).toHaveLength(2);
       
        expect(result[0].label).toBe('Akademik'); 
        expect(result[1].status).toBe('archive'); 
        expect(result[0].title).toContain('Tugas'); // 
    });

    test(' [Fitur Tambah Catatan + Label + Checklist] Harus berhasil membuat catatan baru lengkap membawa properti Label dan status Checklist', async () => {
        const inputNote = {
            title: 'Catatan Baru',
            content: 'Isi teks catatan',
            label: 'Project UAS',
            checklist: 'Belum',
            color: '#CCFF90'
        };

        noteRepository.create.mockResolvedValue({ insertId: 777 });

        const result = await noteService.createNote(inputNote);

        expect(noteRepository.create).toHaveBeenCalledWith(inputNote);
        expect(result).toHaveProperty('insertId');
        expect(result.insertId).toBe(777);
    });

    test(' [Fitur Arsip] Harus berhasil memperbarui status folder catatan menjadi "archive"', async () => {
        const noteId = 1;
        const updatedFields = { status: 'archive' }; 

        noteRepository.update.mockResolvedValue({ affectedRows: 1 });

        const result = await noteService.updateNote(noteId, updatedFields);

        expect(noteRepository.update).toHaveBeenCalledWith(noteId, updatedFields);
        expect(result.affectedRows).toBe(1);
    });

    test(' [Fitur Checklist] Harus berhasil mengubah status Checklist catatan dari "Belum" menjadi "Selesai"', async () => {
        const noteId = 2;
        const updatedFields = { checklist: 'Selesai' }; 

        noteRepository.update.mockResolvedValue({ affectedRows: 1 });

        const result = await noteService.updateNote(noteId, updatedFields);

        expect(noteRepository.update).toHaveBeenCalledWith(noteId, updatedFields);
        expect(result.affectedRows).toBe(1);
    });

    test(' [Fitur Hapus & Sampah] Harus berhasil menghapus catatan secara permanen atau membersihkan folder sampah', async () => {
        const noteId = 1;

        noteRepository.delete.mockResolvedValue({ affectedRows: 1 });

        const result = await noteService.deleteNote(noteId);

        expect(noteRepository.delete).toHaveBeenCalledWith(noteId);
        expect(result.affectedRows).toBe(1);
    });
});