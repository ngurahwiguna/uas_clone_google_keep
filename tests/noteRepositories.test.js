const mysql = require('mysql2/promise');

const mockQuery = jest.fn();
jest.mock('mysql2/promise', () => ({
    createPool: jest.fn(() => ({
        query: mockQuery
    }))
}));

const noteRepository = require('../src/repositories/noteRepositories');

describe('=== UJI COBA NOTE REPOSITORY (DATABASE LAYER) ===', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Fungsi readAll()', () => {
        it('1. Harus sukses mengambil semua data dan mengonversi nilai angka ke boolean', async () => {
            const mockDbRows = [
                { id: 1, title: 'Test', isPinned: 1, isChecklist: 0, isArchived: 0, isTrashed: 0 }
            ];
            mockQuery.mockResolvedValue([mockDbRows]);

            const result = await noteRepository.readAll();

            expect(result[0].isPinned).toBe(true);
            expect(result[0].isChecklist).toBe(false);
            expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM notes');
        });
    });

    describe('Fungsi create()', () => {
        it('2. Harus sukses menyimpan catatan baru menggunakan ID bawaan', async () => {
            const dummyNote = { id: 123, title: 'Halo', content: 'Isi', isPinned: true };
            mockQuery.mockResolvedValue([{}]);

            const result = await noteRepository.create(dummyNote);

            expect(result.id).toBe(123);
            expect(mockQuery).toHaveBeenCalled();
        });

        it('3. Harus menggunakan fallback Date.now() jika data tidak memiliki ID', async () => {
            const dummyNote = { title: 'Tanpa ID', content: 'Isi' };
            mockQuery.mockResolvedValue([{}]);

            const result = await noteRepository.create(dummyNote);

            expect(result).toHaveProperty('id');
            expect(typeof result.id).toBe('number');
        });
    });

    describe('Fungsi update()', () => {
        it('4. Harus memproses query UPDATE jika ada field data yang diubah', async () => {
            const updatedFields = { title: 'Ubah Judul', isPinned: true };
            mockQuery.mockResolvedValue([{}]);

            const result = await noteRepository.update(1, updatedFields);

            expect(result).toHaveProperty('title', 'Ubah Judul');
            expect(mockQuery).toHaveBeenCalled();
        });

        it('5. Harus langsung keluar (return undefined) jika objek perubahan kosong', async () => {
            const result = await noteRepository.update(1, {});
            
            expect(result).toBeUndefined();
            expect(mockQuery).not.toHaveBeenCalled();
        });
    });

    describe('Fungsi delete()', () => {
        it('6. Harus mengeksekusi query DELETE berdasarkan ID yang dituju', async () => {
            mockQuery.mockResolvedValue([{}]);

            const result = await noteRepository.delete(99);

            expect(result).toEqual({ id: 99 });
            expect(mockQuery).toHaveBeenCalledWith('DELETE FROM notes WHERE id = ?', [99]);
        });
    });

    describe('Fungsi searchNotes()', () => {
        it('7. Harus mengeksekusi query pencarian dengan klausa LIKE', async () => {
            mockQuery.mockResolvedValue([[]]);

            await noteRepository.searchNotes('Kuliah');

            expect(mockQuery).toHaveBeenCalledWith(
                'SELECT * FROM notes WHERE (title LIKE ? OR content LIKE ?) AND isTrashed = 0',
                ['%Kuliah%', '%Kuliah%']
            );
        });
    });

    describe('Fungsi writeAll()', () => {
        it('8. Harus menjalankan TRUNCATE dan menghentikan proses jika array notes kosong', async () => {
            mockQuery.mockResolvedValue([{}]);

            await noteRepository.writeAll([]);

            expect(mockQuery).toHaveBeenCalledWith('TRUNCATE TABLE notes');
            expect(mockQuery).toHaveBeenCalledTimes(1); // Tidak lanjut ke INSERT
        });

        it('9. Harus menjalankan TRUNCATE dan memproses bulk INSERT jika ada array data', async () => {
            mockQuery.mockResolvedValue([{}]);
            const bulkData = [
                { id: 1, title: 'A', isPinned: true, isChecklist: false, isArchived: false, isTrashed: false }
            ];

            await noteRepository.writeAll(bulkData);

            expect(mockQuery).toHaveBeenCalledWith('TRUNCATE TABLE notes');
            expect(mockQuery).toHaveBeenCalledTimes(2); // Jalankan TRUNCATE lalu INSERT
        });
    });
});