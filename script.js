const noteForm = document.getElementById("noteForm");
const noteTitle = document.getElementById("noteTitle");
const noteText = document.getElementById("noteText");
const notesList = document.getElementById("notesList");
const notesCount = document.getElementById("notesCount");

const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");

const noteTemplate = document.getElementById("noteTemplate");
const todoTemplate = document.getElementById("todoTemplate");

const STORAGE_KEYS = {
  notes: "cipherSchoolNotes",
  todos: "cipherSchoolTodos",
};

let notes = readFromStorage(STORAGE_KEYS.notes, []);
let todos = readFromStorage(STORAGE_KEYS.todos, []);

function readFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeToStorage() {
  localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
  localStorage.setItem(STORAGE_KEYS.todos, JSON.stringify(todos));
}

function uid() {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function updateCounters() {
  notesCount.textContent = String(notes.length);
  todoCount.textContent = `${todos.filter((item) => !item.done).length} left`;
}

function renderNotes() {
  notesList.innerHTML = "";

  notes.forEach((note) => {
    const node = noteTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector("h3").textContent = note.title;
    node.querySelector("p").textContent = note.text;

    node.querySelector(".delete").addEventListener("click", () => {
      notes = notes.filter((item) => item.id !== note.id);
      writeToStorage();
      renderAll();
    });

    notesList.appendChild(node);
  });
}

function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach((task) => {
    const node = todoTemplate.content.firstElementChild.cloneNode(true);
    const checkbox = node.querySelector("input");
    const text = node.querySelector("span");

    checkbox.checked = task.done;
    text.textContent = task.text;
    node.classList.toggle("done", task.done);

    checkbox.addEventListener("change", () => {
      todos = todos.map((item) =>
        item.id === task.id ? { ...item, done: checkbox.checked } : item
      );
      writeToStorage();
      renderAll();
    });

    node.querySelector(".delete").addEventListener("click", () => {
      todos = todos.filter((item) => item.id !== task.id);
      writeToStorage();
      renderAll();
    });

    todoList.appendChild(node);
  });
}

function renderAll() {
  renderNotes();
  renderTodos();
  updateCounters();
}

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = noteTitle.value.trim();
  const text = noteText.value.trim();
  if (!title || !text) {
    return;
  }

  notes.unshift({ id: uid(), title, text });
  writeToStorage();
  noteForm.reset();
  renderAll();
  noteTitle.focus();
});

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = todoInput.value.trim();
  if (!text) {
    return;
  }

  todos.unshift({ id: uid(), text, done: false });
  writeToStorage();
  todoForm.reset();
  renderAll();
  todoInput.focus();
});

renderAll();
