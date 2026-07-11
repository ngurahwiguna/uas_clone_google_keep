let notes = [];

const title = document.getElementById("title");
const content = document.getElementById("content");
const addBtn = document.getElementById("addBtn");
const notesContainer = document.getElementById("notes");

function renderNotes() {

    notesContainer.innerHTML = "";

    notes.forEach((note, index) => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${note.title}</h3>

            <p>${note.content}</p>

            <div class="actions">

                <button onclick="editNote(${index})">
                    Edit
                </button>

                <button onclick="deleteNote(${index})">
                    Delete
                </button>

            </div>
        `;

        notesContainer.appendChild(card);

    });

}

addBtn.addEventListener("click", () => {

    if(title.value === "" || content.value === ""){

        alert("Isi judul dan catatan!");

        return;
    }

    notes.push({

        title:title.value,

        content:content.value

    });

    title.value = "";

    content.value = "";

    renderNotes();

});

function deleteNote(index){

    notes.splice(index,1);

    renderNotes();

}

function editNote(index){

    const newTitle = prompt("Edit Judul", notes[index].title);

    const newContent = prompt("Edit Isi", notes[index].content);

    if(newTitle !== null){

        notes[index].title = newTitle;

    }

    if(newContent !== null){

        notes[index].content = newContent;

    }

    renderNotes();

}

renderNotes();