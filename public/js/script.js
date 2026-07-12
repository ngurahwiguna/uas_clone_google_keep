let notes = [];
let currentView = 'notes'; 
let currentEditId = null;
let currentDeleteId = null;

let formIsPinned = false;
let formIsChecklist = false;
let formLabel = '';
let formIsArchived = false;
let formReminderDate = ''; 

const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const colorSelect = document.getElementById('color');
const addBtn = document.getElementById('addBtn');
const notesContainer = document.getElementById('notes');
const noteTemplate = document.getElementById('noteTemplate');

const formPinBtn = document.getElementById('pinBtn');
const formChecklistBtn = document.getElementById('checklistBtn');
const formLabelBtn = document.getElementById('labelBtn');
const formArchiveBtn = document.getElementById('archiveBtn');
const formReminderBtn = document.getElementById('reminderBtn');
const formImageBtn = document.getElementById('imageBtn');

const editModal = document.getElementById('editModal');
const deleteModal = document.getElementById('deleteModal');
const editTitleInput = document.getElementById('editTitle');
const editContentInput = document.getElementById('editContent');

const cancelEditBtn = document.getElementById('cancelEdit');
const saveEditBtn = document.getElementById('saveEdit');
const cancelDeleteBtn = document.getElementById('cancelDelete');
const confirmDeleteBtn = document.getElementById('confirmDelete');

async function loadNotes() {
    try {
        const response = await fetch('/api/notes');
        if (response.ok) {
            notes = await response.json();
            renderNotes();
        }
    } catch (error) {
        console.error('🔴 Gagal memuat data dari database:', error);
    }
}

function openCustomLabelModal(currentValue, callback) {
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

    const modalBox = document.createElement('div');
    modalBox.style.backgroundColor = '#fff';
    modalBox.style.padding = '20px';
    modalBox.style.borderRadius = '8px';
    modalBox.style.width = '300px';
    modalBox.style.boxShadow = '0 4px 14px rgba(0,0,0,0.15)';
    modalBox.style.fontFamily = 'inherit';

    const title = document.createElement('h3');
    title.textContent = 'Label Catatan';
    title.style.marginTop = '0';
    title.style.marginBottom = '12px';
    title.style.fontSize = '16px';
    title.style.color = '#3c4043';

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

    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.justifyContent = 'flex-end';
    btnContainer.style.gap = '8px';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Batal';
    cancelBtn.style.padding = '8px 12px';
    cancelBtn.style.border = 'none';
    cancelBtn.style.background = 'none';
    cancelBtn.style.cursor = 'pointer';
    cancelBtn.style.color = '#5f6368';
    cancelBtn.style.fontWeight = '500';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Simpan';
    saveBtn.style.padding = '8px 16px';
    saveBtn.style.border = 'none';
    saveBtn.style.borderRadius = '4px';
    saveBtn.style.backgroundColor = '#fbbc04';
    saveBtn.style.color = '#202124';
    saveBtn.style.cursor = 'pointer';
    saveBtn.style.fontWeight = '500';

    btnContainer.appendChild(cancelBtn);
    btnContainer.appendChild(saveBtn);
    modalBox.appendChild(title);
    modalBox.appendChild(input);
    modalBox.appendChild(btnContainer);
    overlay.appendChild(modalBox);
    document.body.appendChild(overlay);

    input.focus();

    cancelBtn.addEventListener('click', () => overlay.remove());
    saveBtn.addEventListener('click', () => {
        callback(input.value.trim());
        overlay.remove();
    });

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

formPinBtn.addEventListener('click', () => {
    formIsPinned = !formIsPinned;
    formPinBtn.style.color = formIsPinned ? '#fbbc04' : '#5f6368';
});

formChecklistBtn.addEventListener('click', () => {
    formIsChecklist = !formIsChecklist;
    formChecklistBtn.style.color = formIsChecklist ? '#fbbc04' : '#5f6368';
    contentInput.placeholder = formIsChecklist ? 'Tulis list (gunakan Enter untuk baris baru)...' : 'Tulis catatan...';
});

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
        formReminderBtn.style.color = formReminderDate ? '#fbbc04' : '#5f6368';
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
        pinBtn.querySelector('span').style.color = note.isPinned ? '#fbbc04' : '#5f6368';

        // PIN API
        pinBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            try {
                await fetch(`/api/notes/${note.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ isPinned: !note.isPinned })
                });
                loadNotes();
            } catch (err) { console.error(err); }
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

        editBtn.addEventListener('click', async () => {
            if (note.isTrashed) {
                try {
                    await fetch(`/api/notes/${note.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ isTrashed: false })
                    });
                    loadNotes();
                } catch (err) { console.error(err); }
            } else {
                currentEditId = note.id;
                editTitleInput.value = note.title;
                editContentInput.value = note.content;
                editModal.classList.add('show');
            }
        });

        archiveBtn.textContent = note.isArchived ? 'Pindahkan ke Catatan' : 'Arsipkan';
        archiveBtn.addEventListener('click', async () => {
            try {
                await fetch(`/api/notes/${note.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ isArchived: !note.isArchived })
                });
                loadNotes();
            } catch (err) { console.error(err); }
        });

        labelBtn.textContent = note.label ? 'Ubah Label' : 'Tambah Label';
        labelBtn.addEventListener('click', () => {
            openCustomLabelModal(note.label, async (result) => {
                try {
                    await fetch(`/api/notes/${note.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ label: result })
                    });
                    loadNotes();
                } catch (err) { console.error(err); }
            });
        });

        checklistBtn.textContent = note.isChecklist ? 'Ubah ke Teks Biasa' : 'Ubah ke Checklist';
        checklistBtn.addEventListener('click', async () => {
            try {
                await fetch(`/api/notes/${note.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ isChecklist: !note.isChecklist })
                });
                loadNotes();
            } catch (err) { console.error(err); }
        });

        deleteBtn.addEventListener('click', () => {
            currentDeleteId = note.id;
            deleteModal.classList.add('show');
        });

        card.querySelector('.duplicate-btn').addEventListener('click', async () => {
            const duplicatedNote = {
                title: note.title + ' (Salinan)',
                content: note.content,
                color: note.color,
                isPinned: note.isPinned,
                isChecklist: note.isChecklist,
                label: note.label,
                isArchived: note.isArchived,
                reminderDate: note.reminderDate
            };
            try {
                await fetch('/api/notes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(duplicatedNote)
                });
                loadNotes();
            } catch (err) { console.error(err); }
        });

        notesContainer.appendChild(clone);
    });
}

addBtn.addEventListener('click', async (e) => {
    if (e) e.preventDefault(); 

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const color = colorSelect.value;

    if (!title && !content) {
        alert('Catatan tidak boleh kosong!');
        return;
    }

    const newNote = {
        title: title,
        content: content,
        color: color,
        isPinned: formIsPinned,
        isChecklist: formIsChecklist,
        label: formLabel,
        isArchived: formIsArchived,
        reminderDate: formReminderDate
    };

    try {
        const response = await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newNote)
        });

        if (response.ok) {
            resetFormState();
            loadNotes();
        }
    } catch (error) {
        console.error('Gagal mengirim data POST ke server:', error);
    }
});

document.addEventListener('click', () => {
    document.querySelectorAll('.card-menu.show').forEach(m => m.classList.remove('show'));
});

cancelEditBtn.addEventListener('click', () => editModal.classList.remove('show'));

saveEditBtn.addEventListener('click', async () => {
    try {
        const response = await fetch(`/api/notes/${currentEditId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: editTitleInput.value.trim(),
                content: editContentInput.value.trim()
            })
        });

        if (response.ok) {
            editModal.classList.remove('show');
            loadNotes();
        }
    } catch (error) {
        console.error(' Gagal mengubah konten catatan:', error);
    }
});

cancelDeleteBtn.addEventListener('click', () => deleteModal.classList.remove('show'));

confirmDeleteBtn.addEventListener('click', async () => {
    const note = notes.find(n => n.id === currentDeleteId);
    
    if (note) {
        try {
            if (note.isTrashed) {
        
                await fetch(`/api/notes/${currentDeleteId}`, { method: 'DELETE' });
            } else {
             
                await fetch(`/api/notes/${currentDeleteId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ isTrashed: true, isPinned: false })
                });
            }
            deleteModal.classList.remove('show');
            loadNotes();
        } catch (error) {
            console.error(' Gagal menghapus catatan:', error);
        }
    }
});

setInterval(() => {
    const sekarang = new Date();
    const tahun = sekarang.getFullYear();
    const bulan = String(sekarang.getMonth() + 1).padStart(2, '0');
    const tanggal = String(sekarang.getDate()).padStart(2, '0');
    const hariIniString = `${tahun}-${bulan}-${tanggal}`; 

    notes.forEach(note => {
        if (note.reminderDate === hariIniString && !note.isTrashed) {
            alert(` PENGINGAT HARI INI:\n\nCatatan: "${note.title || 'Tanpa Judul'}"\nIsi: ${note.content}`);
            note.reminderDate = ''; 
            // Update status ke server agar alarm tidak terpicu lagi
            fetch(`/api/notes/${note.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reminderDate: '' })
            }).then(() => loadNotes());
        }
    });
}, 60000);

// TRIGGER UTAMA SAAT HALAMAN DIBUKA PERTAMA KALI
document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
});

const searchInput = document.getElementById('searchInput');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase().trim(); 
        const noteCards = document.querySelectorAll('#notes .card'); 

        noteCards.forEach(card => {
            // Ambil teks judul dan isi dari dalam masing-masing kartu
            const title = card.querySelector('.note-title')?.textContent.toLowerCase() || '';
            const content = card.querySelector('.note-content')?.textContent.toLowerCase() || '';

            if (title.includes(keyword) || content.includes(keyword)) {
                card.style.display = '';
            } else {
                card.style.display = 'none'; 
            }
        });
    });
}