const noteService = require('../src/services/noteService');
const noteRepository = require('../src/repositories/noteRepositories');

// Mock Repository
jest.mock('../src/repositories/noteRepositories');

describe('UJI COBA NOTE SERVICE LENGKAP ', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Fungsi createNote()', () => {
        it('1. Sukses buat catatan dengan data lengkap', async () => {
            const data = { title: 'T', content: 'C', isPinned: true };
            noteRepository.create.mockResolvedValue({ id: 1, ...data });
            await noteService.createNote(data);
            expect(noteRepository.create).toHaveBeenCalledWith(data);
        });

        it('2. Sukses buat catatan dengan status arsip', async () => {
            const data = { title: 'T', isArchived: true };
            noteRepository.create.mockResolvedValue({ id: 1, ...data });
            await noteService.createNote(data);
            expect(noteRepository.create).toHaveBeenCalled();
        });

        it('3. Sukses buat catatan dengan status checklist', async () => {
            const data = { title: 'T', isChecklist: true };
            noteRepository.create.mockResolvedValue({ id: 1, ...data });
            await noteService.createNote(data);
            expect(noteRepository.create).toHaveBeenCalled();
        });

        it('4. Sukses buat catatan dengan reminder', async () => {
            const data = { title: 'T', reminderDate: '2026-07-20' };
            noteRepository.create.mockResolvedValue({ id: 1, ...data });
            await noteService.createNote(data);
            expect(noteRepository.create).toHaveBeenCalled();
        });

        it('5. Gagal buat catatan jika database error', async () => {
            noteRepository.create.mockRejectedValue(new Error('DB Error'));
            await expect(noteService.createNote({})).rejects.toThrow('DB Error');
        });
    });

    describe('Fungsi getAllNotes()', () => {
        it('6. Berhasil ambil daftar catatan', async () => {
            noteRepository.readAll.mockResolvedValue([{id: 1}]);
            const res = await noteService.getAllNotes();
            expect(res.length).toBe(1);
        });

        it('7. Berhasil kembalikan array kosong', async () => {
            noteRepository.readAll.mockResolvedValue([]);
            const res = await noteService.getAllNotes();
            expect(res).toEqual([]);
        });

        it('8. Error saat baca database', async () => {
            noteRepository.readAll.mockRejectedValue(new Error('Read Error'));
            await expect(noteService.getAllNotes()).rejects.toThrow('Read Error');
        });
    });

    describe('Fungsi updateNote()', () => {
        it('9. Update Title (String)', async () => {
            noteRepository.update.mockResolvedValue({ id: 1, title: 'New' });
            await noteService.updateNote(1, { title: 'New' });
            expect(noteRepository.update).toHaveBeenCalled();
        });

        it('10. Update Pin Status (Boolean)', async () => {
            noteRepository.update.mockResolvedValue({ id: 1, isPinned: true });
            await noteService.updateNote(1, { isPinned: true });
            expect(noteRepository.update).toHaveBeenCalled();
        });

        it('11. Update Archive Status', async () => {
            noteRepository.update.mockResolvedValue({ id: 1, isArchived: true });
            await noteService.updateNote(1, { isArchived: true });
            expect(noteRepository.update).toHaveBeenCalledWith(1, { isArchived: true });
        });

        it('12. Update Checklist Status', async () => {
            noteRepository.update.mockResolvedValue({ id: 1, isChecklist: true });
            await noteService.updateNote(1, { isChecklist: true });
            expect(noteRepository.update).toHaveBeenCalledWith(1, { isChecklist: true });
        });

        it('13. Update Reminder', async () => {
            noteRepository.update.mockResolvedValue({ id: 1, reminderDate: '2026-08-01' });
            await noteService.updateNote(1, { reminderDate: '2026-08-01' });
            expect(noteRepository.update).toHaveBeenCalledWith(1, { reminderDate: '2026-08-01' });
        });

        it('14. Update Trash Status', async () => {
            noteRepository.update.mockResolvedValue({ id: 1, isTrashed: true });
            await noteService.updateNote(1, { isTrashed: true });
            expect(noteRepository.update).toHaveBeenCalledWith(1, { isTrashed: true });
        });

        it('15. Update Label', async () => {
            noteRepository.update.mockResolvedValue({ id: 1, label: 'Penting' });
            await noteService.updateNote(1, { label: 'Penting' });
            expect(noteRepository.update).toHaveBeenCalledWith(1, { label: 'Penting' });
        });

        it('16. Gagal update saat database error', async () => {
            noteRepository.update.mockRejectedValue(new Error('Update Error'));
            await expect(noteService.updateNote(1, {title: 'Fail'})).rejects.toThrow('Update Error');
        });
    });

    describe('Fungsi deleteNote()', () => {
        it('17. Berhasil hapus catatan', async () => {
            noteRepository.delete.mockResolvedValue({ id: 1 });
            const res = await noteService.deleteNote(1);
            expect(res.id).toBe(1);
        });

        it('18. Error saat hapus', async () => {
            noteRepository.delete.mockRejectedValue(new Error('Delete Error'));
            await expect(noteService.deleteNote(1)).rejects.toThrow('Delete Error');
        });
    });

    describe('Fungsi searchNotes()', () => {
        it('19. Berhasil cari dengan keyword', async () => {
            noteRepository.searchNotes.mockResolvedValue([{title: 'A'}]);
            const res = await noteService.searchNotes('A');
            expect(res[0].title).toBe('A');
        });

        it('20. Berhasil cari keyword tidak ditemukan', async () => {
            noteRepository.searchNotes.mockResolvedValue([]);
            const res = await noteService.searchNotes('XYZ');
            expect(res).toEqual([]);
        });

        it('21. Error saat cari', async () => {
            noteRepository.searchNotes.mockRejectedValue(new Error('Search Error'));
            await expect(noteService.searchNotes('A')).rejects.toThrow('Search Error');
        });
    });

    describe('Eksplorasi Skenario Gabungan', () => {
        it('22. Update banyak field sekaligus (Pin & Archive)', async () => {
            noteRepository.update.mockResolvedValue({ id: 1, isPinned: true, isArchived: true });
            await noteService.updateNote(1, { isPinned: true, isArchived: true });
            expect(noteRepository.update).toHaveBeenCalledWith(1, { isPinned: true, isArchived: true });
        });
        
        it('23. Update dengan Color', async () => {
            noteRepository.update.mockResolvedValue({ id: 1, color: '#ff0000' });
            await noteService.updateNote(1, { color: '#ff0000' });
            expect(noteRepository.update).toHaveBeenCalledWith(1, { color: '#ff0000' });
        });
    });
});