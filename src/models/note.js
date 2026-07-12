class Note {
    constructor({ title, content, color, isPinned, isChecklist, label, isArchived, reminderDate }) {
        this.id = Date.now(); 
        this.title = title || '';
        this.content = content || '';
        this.color = color || '#ffffff';
        this.isPinned = isPinned || false;
        this.isChecklist = isChecklist || false;
        this.label = label || '';
        this.isArchived = isArchived || false;
        this.reminderDate = reminderDate || '';
        this.isTrashed = false;
    }
}

module.exports = Note;