// 1. STATE DATA (Tempat menyimpan data catatan sementara)
let notes = [];
let currentEditId = null;
let currentDeleteId = null;

// 2. AMBIL ELEMEN DOM DARI HTML
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const colorSelect = document.getElementById('color');
const addBtn = document.getElementById('addBtn');
const notesContainer = document.getElementById('notes');
const noteTemplate = document.getElementById('noteTemplate');

// Elemen Modals
const editModal = document.getElementById('editModal');
const deleteModal = document.getElementById('deleteModal');
const editTitleInput = document.getElementById('editTitle');
const editContentInput = document.getElementById('editContent');

// Tombol di dalam Modals
const cancelEditBtn = document.getElementById('cancelEdit');
const saveEditBtn = document.getElementById('saveEdit');
const cancelDeleteBtn = document.getElementById('cancelDelete');
const confirmDeleteBtn = document.getElementById('confirmDelete');

// 3. FUNGSI UNTUK MENAMPILKAN CATATAN KE LAYAR (RENDER)
function renderNotes() {
    // Kosongkan kontainer terlebih dahulu agar tidak menumpuk saat ada data baru
    notesContainer.innerHTML = ''; 

    notes.forEach(note => {
        /* 
           KUNCI UTAMA: Harus menggunakan `.content` sebelum `.cloneNode(true)`.
           Jika tidak pakai `.content`, elemen akan tetap tersembunyi!
        */
        const clone = noteTemplate.content.cloneNode(true);
        const card = clone.querySelector('.card');

        // Isi data catatan ke dalam komponen card hasil klon
        card.style.backgroundColor = note.color;
        card.querySelector('.note-title').textContent = note.title || '(Tanpa Judul)';
        card.querySelector('.note-content').textContent = note.content;

        // --- LOGIKA DROPDOWN MENU (TITIK TIGA) ---
        const menuBtn = card.querySelector('.menu-btn');
        const cardMenu = card.querySelector('.card-menu');

        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Mencegah click event tembus ke body
            
            // Tutup semua dropdown lain yang mungkin sedang terbuka
            document.querySelectorAll('.card-menu.show').forEach(menu => {
                if (menu !== cardMenu) menu.classList.remove('show');
            });
            
            // Toggle menu aktif
            cardMenu.classList.toggle('show');
        });

        // --- LOGIKA TOMBOL EDIT DI DALAM CARD ---
        const editBtn = card.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            currentEditId = note.id;
            editTitleInput.value = note.title;
            editContentInput.value = note.content;
            editModal.classList.add('show'); // Tampilkan modal edit
            cardMenu.classList.remove('show'); // Tutup dropdown
        });

        // --- LOGIKA TOMBOL HAPUS DI DALAM CARD ---
        const deleteBtn = card.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            currentDeleteId = note.id;
            deleteModal.classList.add('show'); // Tampilkan modal konfirmasi hapus
            cardMenu.classList.remove('show'); // Tutup dropdown
        });

        // --- LOGIKA TOMBOL DUPLICATE (BUAT SALINAN) ---
        const duplicateBtn = card.querySelector('.duplicate-btn');
        duplicateBtn.addEventListener('click', () => {
            const duplicatedNote = {
                id: Date.now(),
                title: note.title + " (Salinan)",
                content: note.content,
                color: note.color
            };
            notes.push(duplicatedNote);
            renderNotes();
        });

        // Masukkan elemen card yang sudah jadi ke dalam section #notes
        notesContainer.appendChild(clone);
    });
}

// 4. EVENT LISTENERS

// Aksi Tambah Catatan Baru
addBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const color = colorSelect.value;

    // Validasi: Catatan tidak boleh benar-benar kosong
    if (!title && !content) {
        alert('Tulis sesuatu terlebih dahulu sebelum menambahkan catatan!');
        return;
    }

    // Buat objek data baru
    const newNote = {
        id: Date.now(), // Membuat ID unik berbasis waktu saat ini
        title: title,
        content: content,
        color: color
    };

    // Masukkan ke array utama
    notes.push(newNote);

    // Reset Form Input ke kondisi awal
    titleInput.value = '';
    contentInput.value = '';
    colorSelect.value = '#ffffff';

    // Cetak ulang semua catatan agar data baru muncul
    renderNotes();
});

// Tutup menu dropdown jika pengguna mengklik area mana saja di luar menu
document.addEventListener('click', () => {
    document.querySelectorAll('.card-menu.show').forEach(menu => {
        menu.classList.remove('show');
    });
});

// --- AKSI PADA MODAL EDIT ---
cancelEditBtn.addEventListener('click', () => editModal.classList.remove('show'));
saveEditBtn.addEventListener('click', () => {
    const note = notes.find(n => n.id === currentEditId);
    if (note) {
        note.title = editTitleInput.value.trim();
        note.content = editContentInput.value.trim();
        editModal.classList.remove('show');
        renderNotes();
    }
});

// --- AKSI PADA MODAL DELETE ---
cancelDeleteBtn.addEventListener('click', () => deleteModal.classList.remove('show'));
confirmDeleteBtn.addEventListener('click', () => {
    // Filter array untuk membuang catatan dengan ID yang dipilih
    notes = notes.filter(n => n.id !== currentDeleteId);
    deleteModal.classList.remove('show');
    renderNotes();
});