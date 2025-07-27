// this is a library installed for using the socket's in Node js
const socket = io();
const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const typingStatus = document.getElementById("typing-status");
// taking vaiable as myId and later then manipulating.
let myId = null;

socket.on("connect", () => {
    myId = socket.id;
});

form.addEventListener("submit", (e) => {
    // preventing the defaulut behaviour of the data and HTML elements
    e.preventDefault();
    const message = input.value.trim();
    if (message !== "") {
        displayMessage(message, true);
        // here message is the text typed by user which everyone can view it.
        socket.emit("chat message", message);
        input.value = "";
        socket.emit("typing", false);
    }
});

input.addEventListener("input", () => {
    // function will get triggered when someone starts typing in the input area
    socket.emit("typing", input.value.trim() !== "");
});

socket.on("chat message", (data) => {
    // displays only the message when the Id is correct if it's null then the typed message is not displayed
    if (data.id !== myId) {
        displayMessage(data.msg, false);
    }
});

socket.on("typing", (isTyping) => {
    // creates a typing animation on the area when someone starts typing
    typingStatus.textContent = isTyping ? "Typing." : "";
});

function displayMessage(message, isMine) {
    // always creates a new space for new messages so that the messages dont get overlaped
    const div = document.createElement("div");
    div.className = "message " + (isMine ? "you" : "other");
    div.textContent = message;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}
