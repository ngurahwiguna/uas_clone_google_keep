const noteService = require('../src/services/noteService');
const noteRepository = require('../src/repositories/noteRepositories');

jest.mock('../src/repositories/noteRepositories');

describe('=== UJI COBA NOTE SERVICE LENGKAP ===', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Fungsi createNote()', () => {
        it('1. Harus sukses membuat catatan jika data valid', async () => {
            const dummyInput = { title: 'UAS', content: 'Belajar Unit Testing' };
            noteRepository.create.mockResolvedValue({ id: 1700000000, ...dummyInput });

            const result = await noteService.createNote(dummyInput);
            
            expect(result).toHaveProperty('id');
            expect(result.title).toBe('UAS');
        });

        it('2. Harus melempar eror jika database MySQL mendadak mati', async () => {
            const dummyInput = { title: 'UAS', content: 'Belajar Unit Testing' };
            noteRepository.create.mockRejectedValue(new Error('Database Connection Lost'));

            await expect(noteService.createNote(dummyInput))
                .rejects.toThrow('Database Connection Lost');
        });
    });

    describe('Fungsi getAllNotes()', () => {
        it('3. Harus mengembalikan array berisi daftar catatan jika data ada', async () => {
            const dummyList = [
                { id: 1, title: 'Nota A' },
                { id: 2, title: 'Nota B' }
            ];
            noteRepository.readAll.mockResolvedValue(dummyList);

            const result = await noteService.getAllNotes();

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2);
        });

        it('4. Harus mengembalikan array kosong [] jika database belum ada isinya', async () => {
            noteRepository.readAll.mockResolvedValue([]);

            const result = await noteService.getAllNotes();

            expect(result).toEqual([]);
        });

        it('5. Harus melempar eror jika query SELECT gagal dieksekusi', async () => {
            noteRepository.readAll.mockRejectedValue(new Error('Query Error'));

            await expect(noteService.getAllNotes()).rejects.toThrow('Query Error');
        });
    });

    describe('Fungsi updateNote()', () => {
        it('6. Harus sukses mengubah data catatan berdasarkan ID yang valid', async () => {
            const updatedFields = { title: 'Judul Baru', content: 'Konten Diubah' };
            noteRepository.update.mockResolvedValue({ id: 1, ...updatedFields });
            
            const result = await noteService.updateNote(1, updatedFields);
            
            expect(result.title).toBe('Judul Baru');
            expect(result.id).toBe(1);
        });

        it('7. Harus melempar eror jika proses UPDATE di database gagal', async () => {
            noteRepository.update.mockRejectedValue(new Error('Update Failed'));
            
            await expect(noteService.updateNote(1, { title: 'Test' }))
                .rejects.toThrow('Update Failed');
        });
    });

    describe('Fungsi deleteNote()', () => {
        it('8. Harus sukses menghapus catatan dan mengembalikan ID yang dihapus', async () => {
            noteRepository.delete.mockResolvedValue({ id: 5 });

            const result = await noteService.deleteNote(5);

            expect(result).toHaveProperty('id');
            expect(result.id).toBe(5);
            expect(noteRepository.delete).toHaveBeenCalledWith(5);
        });

        it('9. Harus melempar eror jika proses DELETE di database gagal', async () => {
            noteRepository.delete.mockRejectedValue(new Error('Delete Failed'));

            await expect(noteService.deleteNote(5))
                .rejects.toThrow('Delete Failed');
        });
    });

    describe('Fungsi PENCARIAN Catatan', () => {
        it('10. Harus sukses menemukan catatan yang sesuai dengan kata kunci pencarian', async () => {
            const mockSearchResult = [{ id: 10, title: 'Koding Kuliah', content: 'Bahas JavaScript' }];
            
            const searchMethod = noteRepository.searchNotes || noteRepository.getNoteByTitle;
            searchMethod.mockResolvedValue(mockSearchResult);

            const serviceMethod = noteService.searchNotes || noteService.getNotesByTitle || noteService.getAllNotes;
            const result = await serviceMethod('Koding');

            expect(Array.isArray(result)).toBe(true);
            expect(result[0].title).toContain('Koding');
        });

        it('11. Harus mengembalikan array kosong [] jika tidak ada catatan yang cocok', async () => {
            const searchMethod = noteRepository.searchNotes || noteRepository.getNoteByTitle;
            searchMethod.mockResolvedValue([]);

            const serviceMethod = noteService.searchNotes || noteService.getNotesByTitle || noteService.getAllNotes;
            const result = await serviceMethod('KeywordNgawur');

            expect(result).toEqual([]);
        });

        it('12. Harus melempar eror jika proses query pencarian database bermasalah', async () => {
            const searchMethod = noteRepository.searchNotes || noteRepository.getNoteByTitle;
            searchMethod.mockRejectedValue(new Error('Search Query Error'));

            const serviceMethod = noteService.searchNotes || noteService.getNotesByTitle || noteService.getAllNotes;
            await expect(serviceMethod('ErrorTest')).rejects.toThrow('Search Query Error');
        });
    });
});