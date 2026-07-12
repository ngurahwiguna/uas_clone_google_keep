// 1. STATE DATA UTAMA
let notes = [];
let currentView = 'notes'; 
let currentEditId = null;
let currentDeleteId = null;

// STATE SEMENTARA UNTUK FORM TAMBAH CATATAN
let formIsPinned = false;
let formIsChecklist = false;
let formLabel = '';
let formIsArchived = false;
let formReminderDate = ''; // Menyimpan tanggal (Format: YYYY-MM-DD)

// 2. ELEMEN DOM DARI HTML
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const colorSelect = document.getElementById('color');
const addBtn = document.getElementById('addBtn');
const notesContainer = document.getElementById('notes');
const noteTemplate = document.getElementById('noteTemplate');

// Elemen Tombol di Form Tambah Catatan
const formPinBtn = document.getElementById('pinBtn');
const formChecklistBtn = document.getElementById('checklistBtn');
const formLabelBtn = document.getElementById('labelBtn');
const formArchiveBtn = document.getElementById('archiveBtn');
const formReminderBtn = document.getElementById('reminderBtn');
const formImageBtn = document.getElementById('imageBtn');

// Elemen Modals
const editModal = document.getElementById('editModal');
const deleteModal = document.getElementById('deleteModal');
const editTitleInput = document.getElementById('editTitle');
const editContentInput = document.getElementById('editContent');

// Tombol Modals
const cancelEditBtn = document.getElementById('cancelEdit');
const saveEditBtn = document.getElementById('saveEdit');
const cancelDeleteBtn = document.getElementById('cancelDelete');
const confirmDeleteBtn = document.getElementById('confirmDelete');

// ==========================================
// FUNGSIONALITAS BARU: MODAL LABEL KUSTOM (ANTI POP-UP ATAS)
// ==========================================
function openCustomLabelModal(currentValue, callback) {
    // Membuat overlay latar belakang gelap transparan
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '9999';

    // Membuat kotak modal utama
    const modalBox = document.createElement('div');
    modalBox.style.backgroundColor = '#fff';
    modalBox.style.padding = '20px';
    modalBox.style.borderRadius = '8px';
    modalBox.style.width = '300px';
    modalBox.style.boxShadow = '0 4px 14px rgba(0,0,0,0.15)';
    modalBox.style.fontFamily = 'inherit';

    // Judul Modal
    const title = document.createElement('h3');
    title.textContent = 'Label Catatan';
    title.style.marginTop = '0';
    title.style.marginBottom = '12px';
    title.style.fontSize = '16px';
    title.style.color = '#3c4043';

    // Input Teks Label
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentValue || '';
    input.placeholder = 'Masukkan nama label...';
    input.style.width = '100%';
    input.style.padding = '10px';
    input.style.marginBottom = '16px';
    input.style.border = '1px solid #dadce0';
    input.style.borderRadius = '4px';
    input.style.boxSizing = 'border-box';
    input.style.outline = 'none';
    input.style.fontSize = '14px';

    // Wadah Tombol Aksi
    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.justifyContent = 'flex-end';
    btnContainer.style.gap = '8px';

    // Tombol Batal
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Batal';
    cancelBtn.style.padding = '8px 12px';
    cancelBtn.style.border = 'none';
    cancelBtn.style.background = 'none';
    cancelBtn.style.cursor = 'pointer';
    cancelBtn.style.color = '#5f6368';
    cancelBtn.style.fontWeight = '500';

    // Tombol Simpan
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Simpan';
    saveBtn.style.padding = '8px 16px';
    saveBtn.style.border = 'none';
    saveBtn.style.borderRadius = '4px';
    saveBtn.style.backgroundColor = '#fbbc04';
    saveBtn.style.color = '#202124';
    saveBtn.style.cursor = 'pointer';
    saveBtn.style.fontWeight = '500';

    // Masukkan elemen ke dalam DOM
    btnContainer.appendChild(cancelBtn);
    btnContainer.appendChild(saveBtn);
    modalBox.appendChild(title);
    modalBox.appendChild(input);
    modalBox.appendChild(btnContainer);
    overlay.appendChild(modalBox);
    document.body.appendChild(overlay);

    // Otomatis fokus ke input text
    input.focus();

    // Event handler klik tombol
    cancelBtn.addEventListener('click', () => overlay.remove());
    saveBtn.addEventListener('click', () => {
        callback(input.value.trim());
        overlay.remove();
    });

    // Event handler tombol Enter / Escape keyboard
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            callback(input.value.trim());
            overlay.remove();
        } else if (e.key === 'Escape') {
            overlay.remove();
        }
    });
}

// 3. LOGIKA NAVIGASI SIDEBAR (KIRI)
const sidebarItems = document.querySelectorAll('aside ul li');
sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        sidebarItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const menuText = item.querySelector('span:last-child').textContent.trim();
        if (menuText === 'Catatan') currentView = 'notes';
        else if (menuText === 'Arsip') currentView = 'archive';
        else if (menuText === 'Sampah') currentView = 'trash';
        else if (menuText === 'Label') currentView = 'labels';
        else if (menuText === 'Pengingat') currentView = 'reminders';

        const addNoteSection = document.querySelector('.add-note');
        if (currentView === 'notes') {
            addNoteSection.style.display = 'block';
        } else {
            addNoteSection.style.display = 'none';
        }

        renderNotes();
    });
});

// 4. LOGIKA TOMBOL-TOMBOL DI FORM TAMBAH CATATAN
formPinBtn.addEventListener('click', () => {
    formIsPinned = !formIsPinned;
    formPinBtn.style.color = formIsPinned ? '#fbbc04' : '#5f6368';
});

formChecklistBtn.addEventListener('click', () => {
    formIsChecklist = !formIsChecklist;
    formChecklistBtn.style.color = formIsChecklist ? '#fbbc04' : '#5f6368';
    contentInput.placeholder = formIsChecklist ? 'Tulis list (gunakan Enter untuk baris baru)...' : 'Tulis catatan...';
});

// FIX LABEL FORM: Memanggil modal kustom, bukan prompt atas browser lagi
formLabelBtn.addEventListener('click', () => {
    openCustomLabelModal(formLabel, (result) => {
        formLabel = result;
        formLabelBtn.style.color = formLabel ? '#fbbc04' : '#5f6368';
    });
});

formArchiveBtn.addEventListener('click', () => {
    formIsArchived = !formIsArchived;
    formArchiveBtn.style.color = formIsArchived ? '#fbbc04' : '#5f6368';
});

// LOGIKA PENGINGAT
formReminderBtn.addEventListener('click', () => {
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    
    dateInput.style.position = 'absolute';
    dateInput.style.opacity = '0';
    dateInput.style.top = '0';
    dateInput.style.left = '0';
    
    document.body.appendChild(dateInput); 
    
    dateInput.addEventListener('change', (e) => {
        formReminderDate = e.target.value;
        if (formReminderDate) {
            formReminderBtn.style.color = '#fbbc04'; 
        } else {
            formReminderBtn.style.color = '#5f6368';
        }
        dateInput.remove(); 
    });

    dateInput.addEventListener('blur', () => {
        setTimeout(() => dateInput.remove(), 200);
    });
    
    dateInput.focus();
    try {
        dateInput.showPicker();
    } catch (err) {
        dateInput.click(); 
    }
});

formImageBtn.addEventListener('click', () => {
    alert('Fitur tambah gambar akan diintegrasikan dengan backend nanti!');
});

// FUNGSI RESET FORM SETELAH BERHASIL SUBMIT
function resetFormState() {
    titleInput.value = '';
    contentInput.value = '';
    colorSelect.value = '#ffffff';
    contentInput.placeholder = 'Tulis catatan...';

    formIsPinned = false;
    formIsChecklist = false;
    formLabel = '';
    formIsArchived = false;
    formReminderDate = '';

    [formPinBtn, formChecklistBtn, formLabelBtn, formArchiveBtn, formReminderBtn].forEach(btn => {
        btn.style.color = '#5f6368';
    });
}

// 5. FUNGSI UNTUK MENAMPILKAN CATATAN
function renderNotes() {
    notesContainer.innerHTML = ''; 

    let filteredNotes = notes.filter(note => {
        if (currentView === 'notes') return !note.isArchived && !note.isTrashed;
        if (currentView === 'archive') return note.isArchived && !note.isTrashed;
        if (currentView === 'trash') return note.isTrashed;
        if (currentView === 'labels') return note.label && !note.isTrashed;
        if (currentView === 'reminders') return note.reminderDate && !note.isTrashed;
        return true;
    });

    filteredNotes.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    filteredNotes.forEach(note => {
        const clone = noteTemplate.content.cloneNode(true);
        const card = clone.querySelector('.card');

        card.style.backgroundColor = note.color;
        card.querySelector('.note-title').textContent = note.title || '(Tanpa Judul)';
        
        const contentEl = card.querySelector('.note-content');
        if (note.isChecklist) {
            contentEl.innerHTML = '';
            const lines = note.content.split('\n');
            lines.forEach(line => {
                if (line.trim() === '') return;
                
                const itemDiv = document.createElement('div');
                itemDiv.style.display = 'flex';
                itemDiv.style.alignItems = 'center';
                itemDiv.style.gap = '8px';
                itemDiv.style.marginBottom = '4px';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                
                const textSpan = document.createElement('span');
                textSpan.textContent = line;

                itemDiv.appendChild(checkbox);
                itemDiv.appendChild(textSpan);
                contentEl.appendChild(itemDiv);
            });
        } else {
            contentEl.textContent = note.content;
        }

        const labelBadge = card.querySelector('.note-label');
        if (note.label) {
            labelBadge.textContent = note.label;
            labelBadge.style.display = 'inline-block';
        } else {
            labelBadge.style.display = 'none';
        }

        const reminderBadge = card.querySelector('.note-reminder');
        if (note.reminderDate) {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            const formattedDate = new Date(note.reminderDate).toLocaleDateString('id-ID', options);
            
            reminderBadge.textContent = `📅 ${formattedDate}`;
            reminderBadge.style.display = 'inline-block';
        } else {
            reminderBadge.style.display = 'none';
        }

        const pinBtn = card.querySelector('.pin-btn');
        if (note.isPinned) {
            pinBtn.querySelector('span').style.color = '#fbbc04'; 
        } else {
            pinBtn.querySelector('span').style.color = '#5f6368';
        }

        pinBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            note.isPinned = !note.isPinned;
            renderNotes();
        });

        const menuBtn = card.querySelector('.menu-btn');
        const cardMenu = card.querySelector('.card-menu');
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.card-menu.show').forEach(m => {
                if (m !== cardMenu) m.classList.remove('show');
            });
            cardMenu.classList.toggle('show');
        });

        const editBtn = card.querySelector('.edit-btn');
        const archiveBtn = card.querySelector('.archive-btn');
        const deleteBtn = card.querySelector('.delete-btn');
        const checklistBtn = card.querySelector('.checklist-btn');
        const labelBtn = card.querySelector('.label-btn');

        if (note.isTrashed) {
            editBtn.textContent = 'Pulihkan Catatan';
            archiveBtn.style.display = 'none';
            checklistBtn.style.display = 'none';
            labelBtn.style.display = 'none';
            pinBtn.style.display = 'none';
            deleteBtn.textContent = 'Hapus Permanen';
        } else {
            editBtn.textContent = 'Edit';
            archiveBtn.style.display = 'block';
            checklistBtn.style.display = 'block';
            labelBtn.style.display = 'block';
            pinBtn.style.display = 'block';
            deleteBtn.textContent = 'Hapus';
        }

        editBtn.addEventListener('click', () => {
            if (note.isTrashed) {
                note.isTrashed = false;
                renderNotes();
            } else {
                currentEditId = note.id;
                editTitleInput.value = note.title;
                editContentInput.value = note.content;
                editModal.classList.add('show');
            }
        });

        archiveBtn.textContent = note.isArchived ? 'Pindahkan ke Catatan' : 'Arsirkan';
        archiveBtn.addEventListener('click', () => {
            note.isArchived = !note.isArchived;
            renderNotes();
        });

        // FIX LABEL KARTU: Memanggil modal kustom yang sama biar ga ada dialog atas browser
        labelBtn.textContent = note.label ? 'Ubah Label' : 'Tambah Label';
        labelBtn.addEventListener('click', () => {
            openCustomLabelModal(note.label, (result) => {
                note.label = result;
                renderNotes();
            });
        });

        checklistBtn.textContent = note.isChecklist ? 'Ubah ke Teks Biasa' : 'Ubah ke Checklist';
        checklistBtn.addEventListener('click', () => {
            note.isChecklist = !note.isChecklist;
            renderNotes();
        });

        deleteBtn.addEventListener('click', () => {
            currentDeleteId = note.id;
            deleteModal.classList.add('show');
        });

        card.querySelector('.duplicate-btn').addEventListener('click', () => {
            notes.push({
                ...note,
                id: Date.now(),
                title: note.title + ' (Salinan)'
            });
            renderNotes();
        });

        notesContainer.appendChild(clone);
    });
}

// 6. EVENT LISTENERS TOMBOL TAMBAH UTAMA
addBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const color = colorSelect.value;

    if (!title && !content) {
        alert('Catatan tidak boleh kosong!');
        return;
    }

    const newNote = {
        id: Date.now(),
        title: title,
        content: content,
        color: color,
        isPinned: formIsPinned,
        isChecklist: formIsChecklist,
        label: formLabel,
        isArchived: formIsArchived,
        reminderDate: formReminderDate, 
        isTrashed: false
    };

    notes.push(newNote);
    resetFormState();
    renderNotes();
});

document.addEventListener('click', () => {
    document.querySelectorAll('.card-menu.show').forEach(m => m.classList.remove('show'));
});

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

cancelDeleteBtn.addEventListener('click', () => deleteModal.classList.remove('show'));
confirmDeleteBtn.addEventListener('click', () => {
    const note = notes.find(n => n.id === currentDeleteId);
    
    if (note) {
        if (note.isTrashed) {
            notes = notes.filter(n => n.id !== currentDeleteId);
        } else {
            note.isTrashed = true;
            note.isPinned = false;
        }
    }
    
    deleteModal.classList.remove('show');
    renderNotes();
});

// --- PENGECEK ALARM HARIAN OTOMATIS (MENGGUNAKAN MODAL BUKAN ALERT BAWAAN) ---
setInterval(() => {
    const sekarang = new Date();
    const tahun = sekarang.getFullYear();
    const bulan = String(sekarang.getMonth() + 1).padStart(2, '0');
    const tanggal = String(sekarang.getDate()).padStart(2, '0');
    const hariIniString = `${tahun}-${bulan}-${tanggal}`; 

    notes.forEach(note => {
        if (note.reminderDate === hariIniString && !note.isTrashed) {
            // Kita biarkan alarm hariannya pakai modal kustom bawaan jika ingin diganti nanti,
            // saat ini agar sistem tetap memicu pemberitahuan kita pertahankan alert/custom dialog.
            alert(`📅 PENGINGAT HARI INI:\n\nCatatan: "${note.title || 'Tanpa Judul'}"\nIsi: ${note.content}`);
            note.reminderDate = ''; 
            renderNotes(); 
        }
    });
}, 60000);