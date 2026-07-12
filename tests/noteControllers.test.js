const noteController = require('../src/controllers/noteControllers');
const noteService = require('../src/services/noteService');

jest.mock('../src/services/noteService');

describe('=== UJI COBA NOTE CONTROLLER (FULL COVERAGE) ===', () => {
    let req, res;
    let consoleSpy;

    beforeAll(() => {
        consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        consoleSpy.mockRestore();
    });

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            query: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('POST /api/notes (createNote)', () => {
        it('1. Harus mengembalikan data catatan jika sukses dengan field lengkap', async () => {
            req.body = { 
                title: 'Nota Controller', 
                content: 'Tes dari controller',
                isPinned: 0,
                isChecklist: 0,
                label: null,
                isArchived: 0,
                reminderDate: null,
                isTrashed: 0
            };
            const mockSavedNote = { id: 999, ...req.body };
            
            noteService.createNote.mockResolvedValue(mockSavedNote);

            await noteController.createNote(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockSavedNote);
        });

        it('2. Harus mengembalikan status 500 jika service melempar eror', async () => {
            req.body = { title: 'Eror Test' };
            noteService.createNote.mockRejectedValue(new Error('Controller Error'));

            await noteController.createNote(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Gagal menyimpan catatan baru'
            }));
        });
    });

    describe('GET /api/notes (getAllNotes)', () => {
        it('3. Harus mengembalikan daftar catatan lewat res.json', async () => {
            const mockList = [{ id: 1, title: 'Nota 1' }, { id: 2, title: 'Nota 2' }];
            noteService.getAllNotes.mockResolvedValue(mockList);

            await noteController.getAllNotes(req, res);

            expect(res.json).toHaveBeenCalledWith(mockList);
        });

        it('4. Harus mengembalikan status 500 jika query gagal', async () => {
            noteService.getAllNotes.mockRejectedValue(new Error('Read Error'));

            await noteController.getAllNotes(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('PUT /api/notes/:id (updateNote)', () => {
        it('5. Harus mengembalikan data terupdate dengan field lengkap', async () => {
            req.params.id = '1';
            req.body = { 
                title: 'Judul Baru',
                isArchived: 1 // Contoh update status arsip
            };
            const mockUpdated = { id: 1, title: 'Judul Baru', isArchived: 1 };
            
            noteService.updateNote.mockResolvedValue(mockUpdated);

            await noteController.updateNote(req, res);

            expect(res.json).toHaveBeenCalledWith(mockUpdated);
        });

        it('Harus mengembalikan 404 jika catatan tidak ditemukan', async () => {
            req.params.id = '999';
            noteService.updateNote.mockResolvedValue(null);

            await noteController.updateNote(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('Harus mengembalikan status 500 jika update gagal', async () => {
            req.params.id = '1';
            noteService.updateNote.mockRejectedValue(new Error('Update Error'));

            await noteController.updateNote(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('DELETE /api/notes/:id (deleteNote)', () => {
        it('6. Harus mengembalikan pesan sukses setelah berhasil menghapus', async () => {
            req.params.id = '1';
            noteService.deleteNote.mockResolvedValue(true);

            await noteController.deleteNote(req, res);

            expect(res.json).toHaveBeenCalledWith({ message: 'Catatan berhasil dihapus' });
        });

        it('Harus mengembalikan 404 jika delete gagal (catatan tidak ada)', async () => {
            req.params.id = '1';
            noteService.deleteNote.mockResolvedValue(false);

            await noteController.deleteNote(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('Harus mengembalikan status 500 jika terjadi server error saat delete', async () => {
            req.params.id = '1';
            noteService.deleteNote.mockRejectedValue(new Error('Delete Error'));

            await noteController.deleteNote(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('GET /api/notes/search (searchNotes)', () => {
        it('7. Harus mengembalikan hasil pencarian', async () => {
            req.query = { query: 'test' };
            const mockResults = [{ id: 1, title: 'test note' }];
            noteService.searchNotes.mockResolvedValue(mockResults);

            await noteController.searchNotes(req, res);

            expect(res.json).toHaveBeenCalledWith(mockResults);
        });

        it('Harus mengembalikan status 500 jika search gagal', async () => {
            req.query = { query: 'fail' };
            noteService.searchNotes.mockRejectedValue(new Error('Search Error'));

            await noteController.searchNotes(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});