const socket = io();
const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const typingStatus = document.getElementById("typing-status");

let myId = null;

socket.on("connect", () => {
    myId = socket.id;
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (message !== "") {
        displayMessage(message, true);
        socket.emit("chat message", message);
        input.value = "";
        socket.emit("typing", false);
    }
});

input.addEventListener("input", () => {
    socket.emit("typing", input.value.trim() !== "");
});

socket.on("chat message", (data) => {
    if (data.id !== myId) {
        displayMessage(data.msg, false);
    }
});

socket.on("typing", (isTyping) => {
    typingStatus.textContent = isTyping ? "Typing." : "";
});

function displayMessage(message, isMine) {
    const div = document.createElement("div");
    div.className = "message " + (isMine ? "you" : "other");
    div.textContent = message;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}
