const socket = io();
const editor = document.getElementById("editor");
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const usernameInput = document.getElementById("usernameInput");
const landing = document.getElementById("landing");
const toolbar = document.getElementById("toolbar");
const filenameDisplay = document.getElementById("filename");
const docIdDisplay = document.getElementById("docIdDisplay");
const editorsDisplay = document.getElementById("editorsDisplay");
const downloadBtn = document.getElementById("downloadBtn");
const shareBtn = document.getElementById("shareBtn");
const modeToggle = document.getElementById("modeToggle");

let docId = null;
let username = null;

// Check if user came via a shared link
const params = new URLSearchParams(window.location.search);
const sharedDocId = params.get("doc");

if (sharedDocId) {
    // Hide upload section, prompt for name only
    landing.innerHTML = `
        <input type="text" id="usernameInput" placeholder="Enter your name to join" />
        <button id="joinBtn">Join</button>
    `;
    const joinBtn = document.getElementById("joinBtn");
    const nameInput = document.getElementById("usernameInput");

    joinBtn.addEventListener("click", () => {
        username = nameInput.value.trim();
        if (!username) return alert("Enter your name!");
        docId = sharedDocId;
        landing.style.display = "none";
        toolbar.style.display = "flex";
        editor.style.display = "block";
        editor.focus();
        socket.emit("join-doc", {docId, username});
    });
}

// Upload new document
uploadBtn?.addEventListener("click", async () => {
    username = usernameInput.value.trim();
    if (!username) return alert("Enter your name!");
    if (!fileInput.files[0]) return alert("Select a file!");

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    const res = await fetch("/upload", {method: "POST", body: formData});
    const data = await res.json();

    docId = data.docId;
    filenameDisplay.textContent = fileInput.files[0].name;
    docIdDisplay.textContent = `Doc ID: ${docId}`;
    toolbar.style.display = "flex";
    editor.style.display = "block";
    editor.value = data.content;
    editor.focus();
    landing.style.display = "none";

    socket.emit("join-doc", {docId, username});
});

// Handle live edits
editor.addEventListener("input", () => {
    if (!docId || !username) return;
    socket.emit("edit-doc", editor.value);
});

socket.on("update-doc", (data) => {
    const cursorPos = editor.selectionStart;
    editor.value = data;
    editor.selectionStart = editor.selectionEnd = cursorPos;
});

socket.on("editors-update", (editors) => {
    editorsDisplay.textContent = `Editing: ${editors.join(", ")}`;
});

// Share button
shareBtn.addEventListener("click", () => {
    const url = `${window.location.origin}?doc=${docId}`;
    prompt("Share this link to invite others:", url);
});

// Download funcitonalty after editing
downloadBtn.addEventListener("click", () => {
    const blob = new Blob([editor.value], {type: "text/plain"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filenameDisplay.textContent || "document.txt";
    a.click();
});

// Dark / Light toggle
modeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
});
