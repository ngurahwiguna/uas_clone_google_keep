const noteController = require('../src/controllers/noteControllers'); // Sesuaikan nama file controllermu
const noteService = require('../src/services/noteService');

jest.mock('../src/services/noteService');

describe('=== UJI COBA NOTE CONTROLLER ===', () => {
    let req, res;

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
        it('1. Harus mengembalikan status 201/200 dan data catatan jika sukses', async () => {
            req.body = { title: 'Nota Controller', content: 'Tes dari controller' };
            const mockSavedNote = { id: 999, ...req.body };
            
            noteService.createNote.mockResolvedValue(mockSavedNote);

            await noteController.createNote(req, res);

            expect(res.status).toHaveBeenCalledWith(expect.composedPath ? 201 : expect.any(Number));
            expect(res.json).toHaveBeenCalledWith(mockSavedNote);
        });

        it('2. Harus mengembalikan status 500 jika service melempar eror', async () => {
            req.body = { title: 'Eror Test' };
            noteService.createNote.mockRejectedValue(new Error('Controller Error'));

            await noteController.createNote(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Controller Error'
            }));
        });
    });

    describe('GET /api/notes (getAllNotes)', () => {
        it('3. Harus mengembalikan status 200 dan daftar catatan', async () => {
            const mockList = [{ id: 1, title: 'Nota 1' }, { id: 2, title: 'Nota 2' }];
            noteService.getAllNotes.mockResolvedValue(mockList);

            await noteController.getAllNotes(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockList);
        });

        it('4. Harus mengembalikan status 500 jika query gagal', async () => {
            noteService.getAllNotes.mockRejectedValue(new Error('Read Error'));

            await noteController.getAllNotes(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('PUT /api/notes/:id (updateNote)', () => {
        it('5. Harus mengembalikan status 200 setelah berhasil update', async () => {
            req.params.id = '1';
            req.body = { title: 'Judul Baru' };
            noteService.updateNote.mockResolvedValue({ id: 1, title: 'Judul Baru' });

            await noteController.updateNote(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ id: 1, title: 'Judul Baru' });
        });
    });

    describe('DELETE /api/notes/:id (deleteNote)', () => {
        it('6. Harus mengembalikan status 200 setelah berhasil menghapus', async () => {
            req.params.id = '1';
            noteService.deleteNote.mockResolvedValue({ id: 1 });

            await noteController.deleteNote(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ id: 1 });
        });
    });
});