// ELEMENT
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const colorInput = document.getElementById("color");
const addBtn = document.getElementById("addBtn");
const searchInput = document.getElementById("searchInput");

const notesContainer = document.getElementById("notes");
const template = document.getElementById("noteTemplate");

// DATA
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// SAVE
function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

// RENDER
function renderNotes(keyword = "") {

    notesContainer.innerHTML = "";

    const filtered = notes.filter(note => {

        return (
            note.title.toLowerCase().includes(keyword.toLowerCase()) ||
            note.content.toLowerCase().includes(keyword.toLowerCase())
        );

    });

    filtered.sort((a, b) => b.pinned - a.pinned);

    filtered.forEach(note => {

        const clone = template.content.cloneNode(true);

        clone.querySelector(".card").style.background = note.color;

        clone.querySelector(".note-title").textContent = note.title;

        clone.querySelector(".note-content").textContent = note.content;

        const pinBtn = clone.querySelector(".pin-btn");

        if (note.pinned) {

            pinBtn.style.color = "#fbbc04";

        }

        pinBtn.addEventListener("click", () => {

            note.pinned = !note.pinned;

            saveNotes();

            renderNotes(searchInput.value);

        });

        clone.querySelector(".edit-btn")
        .addEventListener("click", () => {

            editNote(note.id);

        });

        clone.querySelector(".delete-btn")
        .addEventListener("click", () => {

            deleteNote(note.id);

        });

        notesContainer.appendChild(clone);

    });

}

// ADD
addBtn.addEventListener("click", () => {

    if (titleInput.value.trim() === "") {

        alert("Judul tidak boleh kosong");

        return;

    }

    notes.push({

        id: Date.now(),

        title: titleInput.value,

        content: contentInput.value,

        color: colorInput.value,

        pinned: false

    });

    titleInput.value = "";

    contentInput.value = "";

    colorInput.value = "#ffffff";

    saveNotes();

    renderNotes(searchInput.value);

});

// DELETE
function deleteNote(id) {

    if (!confirm("Hapus catatan ini?")) return;

    notes = notes.filter(note => note.id !== id);

    saveNotes();

    renderNotes(searchInput.value);

}

// EDIT
function editNote(id) {

    const note = notes.find(n => n.id === id);

    if (!note) return;

    const newTitle = prompt("Judul", note.title);

    if (newTitle === null) return;

    const newContent = prompt("Isi Catatan", note.content);

    if (newContent === null) return;

    note.title = newTitle;

    note.content = newContent;

    saveNotes();

    renderNotes(searchInput.value);

}

// SEARCH
searchInput.addEventListener("keyup", () => {

    renderNotes(searchInput.value);

});
// START
renderNotes();