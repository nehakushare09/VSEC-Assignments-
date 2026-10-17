const API_URL = "/api/books";
const statuses = ["Want to Read", "Reading", "Completed"];
const colors = ["sage", "rose", "blue", "gold", "lavender"];
const grid = document.querySelector("#book-grid");
const template = document.querySelector("#book-template");
const dialog = document.querySelector("#book-dialog");
const form = document.querySelector("#book-form");
const searchInput = document.querySelector("#search-input");
const notice = document.querySelector("#notice");
let books = [];
let activeFilter = "All";
let editingId = null;
let searchTimer;

async function request(url, options = {}) {
  let response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new Error("Could not reach BookBuddy. Check that the server is running and try again.");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong. Please try again.");
  return data;
}

function showNotice(message, kind = "error") {
  notice.textContent = message;
  notice.className = `notice ${kind}`;
  notice.hidden = false;
}
function hideNotice() { notice.hidden = true; }

async function loadBooks(search = "") {
  grid.innerHTML = '<div class="loading-state">Gathering your books<span>…</span></div>';
  try {
    books = await request(`${API_URL}?search=${encodeURIComponent(search)}`);
    hideNotice();
    renderBooks();
  } catch (error) {
    books = [];
    renderBooks();
    showNotice(error.message);
  }
}

function renderBooks() {
  const filtered = books.filter((book) => activeFilter === "All" || book.status === activeFilter);
  grid.replaceChildren();
  document.querySelector("#book-count").textContent = `${books.length} ${books.length === 1 ? "book" : "books"}`;
  document.querySelector("#all-count").textContent = books.length;
  document.querySelectorAll(".filter-button").forEach((button) => button.classList.toggle("active", button.dataset.filter === activeFilter));

  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = books.length === 0 && !searchInput.value.trim()
      ? '<span class="empty-icon">✳</span><h3>Your shelf is waiting</h3><p>Add the first book you want to keep track of.</p><button class="primary-button" type="button">＋ Add a book</button>'
      : '<span class="empty-icon">⌕</span><h3>No books found</h3><p>Try a different search or choose another shelf.</p>';
    const emptyButton = empty.querySelector("button");
    if (emptyButton) emptyButton.addEventListener("click", () => openDialog());
    grid.append(empty);
    return;
  }

  filtered.forEach((book) => {
    const card = template.content.firstElementChild.cloneNode(true);
    const index = books.findIndex((item) => item._id === book._id);
    card.classList.add(colors[index % colors.length]);
    card.querySelector(".genre-label").textContent = book.genre;
    card.querySelector(".cover-title").textContent = book.title;
    card.querySelector(".cover-author").textContent = book.author;
    card.querySelector(".card-title").textContent = book.title;
    card.querySelector(".card-author").textContent = `by ${book.author}`;
    card.querySelector(".status-pill").textContent = book.status;
    card.querySelector(".status-pill").classList.add(`status-${statuses.indexOf(book.status)}`);
    card.querySelector(".added-date").textContent = book.createdAt
      ? new Intl.DateTimeFormat(undefined, { month: "short", year: "numeric" }).format(new Date(book.createdAt))
      : "Just added";
    const menu = card.querySelector(".action-menu");
    card.querySelector(".more-button").addEventListener("click", (event) => {
      event.stopPropagation();
      document.querySelectorAll(".action-menu").forEach((other) => { if (other !== menu) other.hidden = true; });
      menu.hidden = !menu.hidden;
    });
    card.querySelector(".edit-action").addEventListener("click", () => { menu.hidden = true; openDialog(book); });
    card.querySelector(".delete-action").addEventListener("click", () => deleteBook(book));
    grid.append(card);
  });
}

function openDialog(book = null) {
  editingId = book?._id || null;
  form.reset();
  document.querySelector("#form-error").hidden = true;
  document.querySelector("#dialog-title").textContent = book ? "Edit your book" : "A new chapter";
  document.querySelector("#form-eyebrow").textContent = book ? "UPDATE YOUR SHELF" : "ADD TO YOUR SHELF";
  document.querySelector("#save-button").innerHTML = book ? 'Save changes <span aria-hidden="true">→</span>' : 'Add book <span aria-hidden="true">→</span>';
  if (book) {
    form.elements.title.value = book.title;
    form.elements.author.value = book.author;
    form.elements.genre.value = book.genre;
    form.elements.status.value = book.status;
  }
  dialog.showModal();
  form.elements.title.focus();
}

document.querySelector("#add-book-button").addEventListener("click", () => openDialog());
document.querySelectorAll(".close-dialog").forEach((button) => button.addEventListener("click", () => dialog.close()));
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
document.addEventListener("click", () => document.querySelectorAll(".action-menu").forEach((menu) => { menu.hidden = true; }));
document.querySelectorAll(".filter-button").forEach((button) => button.addEventListener("click", () => { activeFilter = button.dataset.filter; renderBooks(); }));
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => loadBooks(searchInput.value.trim()), 250);
});
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); searchInput.focus(); }
  if (event.key === "Escape") document.querySelectorAll(".action-menu").forEach((menu) => { menu.hidden = true; });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const errorBox = document.querySelector("#form-error");
  errorBox.hidden = true;
  const payload = Object.fromEntries(new FormData(form).entries());
  if (!payload.title.trim() || !payload.author.trim() || !payload.genre.trim()) {
    errorBox.textContent = "Please fill in the title, author, and genre.";
    errorBox.hidden = false;
    return;
  }
  if (!statuses.includes(payload.status)) {
    errorBox.textContent = "Please choose a valid reading status.";
    errorBox.hidden = false;
    return;
  }
  const saveButton = document.querySelector("#save-button");
  saveButton.disabled = true;
  try {
    await request(editingId ? `${API_URL}/${editingId}` : API_URL, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    dialog.close();
    await loadBooks(searchInput.value.trim());
    showNotice(editingId ? "Your book details have been updated." : "Your book has been added to the shelf.", "success");
  } catch (error) {
    errorBox.textContent = error.message;
    errorBox.hidden = false;
  } finally {
    saveButton.disabled = false;
  }
});

async function deleteBook(book) {
  if (!window.confirm(`Remove “${book.title}” from your shelf?`)) return;
  try {
    await request(`${API_URL}/${book._id}`, { method: "DELETE" });
    await loadBooks(searchInput.value.trim());
    showNotice("The book was removed from your shelf.", "success");
  } catch (error) {
    showNotice(error.message);
  }
}

loadBooks();
