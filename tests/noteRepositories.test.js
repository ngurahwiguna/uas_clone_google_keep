const mysql = require('mysql2/promise');

const mockQuery = jest.fn();
jest.mock('mysql2/promise', () => ({
    createPool: jest.fn(() => ({
        query: mockQuery
    }))
}));

const noteRepository = require('../src/repositories/noteRepositories');

describe('=== UJI COBA NOTE REPOSITORY (100% COVERAGE) ===', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Fungsi readAll()', () => {
        it('Harus sukses mengonversi 1 ke true dan 0 ke false', async () => {
            const mockDbRows = [
                { id: 1, title: 'TrueTest', isPinned: 1, isChecklist: 1, isArchived: 1, isTrashed: 1 },
                { id: 2, title: 'FalseTest', isPinned: 0, isChecklist: 0, isArchived: 0, isTrashed: 0 }
            ];
            mockQuery.mockResolvedValue([mockDbRows]);

            const result = await noteRepository.readAll();

            expect(result[0].isPinned).toBe(true);
            expect(result[1].isPinned).toBe(false); // Menutup cabang logika boolean
        });
    });

    describe('Fungsi create()', () => {
        it('Harus sukses menyimpan catatan (dengan ID)', async () => {
            mockQuery.mockResolvedValue([{}]);
            await noteRepository.create({ id: 123, title: 'A' });
            expect(mockQuery).toHaveBeenCalled();
        });

        it('Harus menggunakan Date.now() jika ID tidak ada', async () => {
            mockQuery.mockResolvedValue([{}]);
            await noteRepository.create({ title: 'B' });
            expect(mockQuery).toHaveBeenCalled();
        });
    });

    describe('Fungsi update()', () => {
        it('Harus menembus line 47 (return undefined jika objek kosong)', async () => {
            const result = await noteRepository.update(1, {}); // Memicu fields.length === 0
            expect(result).toBeUndefined();
        });

        it('Harus menembus line 33-34 (Update String - Else Branch)', async () => {
            mockQuery.mockResolvedValue([{}]);
            await noteRepository.update(1, { title: 'Test String' }); // Memicu ELSE (bukan boolean)
            expect(mockQuery).toHaveBeenCalled();
        });

        it('Harus menembus cabang Boolean (If Branch)', async () => {
            mockQuery.mockResolvedValue([{}]);
            await noteRepository.update(1, { isPinned: true }); // Memicu IF (boolean)
            expect(mockQuery).toHaveBeenCalled();
        });
    });

    describe('Fungsi delete()', () => {
        it('Harus menjalankan query DELETE', async () => {
            mockQuery.mockResolvedValue([{}]);
            await noteRepository.delete(99);
            expect(mockQuery).toHaveBeenCalledWith('DELETE FROM notes WHERE id = ?', [99]);
        });
    });

    describe('Fungsi searchNotes()', () => {
        it('Harus mapping hasil pencarian', async () => {
            mockQuery.mockResolvedValue([[{ id: 1, title: 'A', isPinned: 1 }]]);
            const result = await noteRepository.searchNotes('A');
            expect(result[0].isPinned).toBe(true);
        });
    });

    describe('Fungsi writeAll()', () => {
        it('Harus menembus line 85-86 (Array kosong)', async () => {
            mockQuery.mockResolvedValue([{}]);
            await noteRepository.writeAll([]); // Memicu if (notes.length === 0)
            expect(mockQuery).toHaveBeenCalledWith('TRUNCATE TABLE notes');
            expect(mockQuery).toHaveBeenCalledTimes(1);
        });

        it('Harus INSERT jika array ada data', async () => {
            mockQuery.mockResolvedValue([{}]);
            await noteRepository.writeAll([{ id: 1, title: 'A', isPinned: true }]);
            expect(mockQuery).toHaveBeenCalledTimes(2);
        });
    });
});