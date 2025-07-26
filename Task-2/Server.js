const express = require("express");
const path = require("path");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const PORT = 3000;

app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
    socket.on("chat message", (data) => {
        io.emit("chat message", {id: socket.id, msg: data});
    });

    socket.on("typing", (isTyping) => {
        socket.broadcast.emit("typing", isTyping);
    });

    socket.on("disconnect", () => {});
});

http.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
