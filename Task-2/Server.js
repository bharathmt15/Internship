// using express as we are building a node js project
const express = require("express");
// it's a library used for routing
const path = require("path");
// calling express function
const app = express();
// creating a server naming it as app
const http = require("http").createServer(app);
// using the socket.io library along with the http server function
const io = require("socket.io")(http);
// assigning a port to the server
const PORT = 3000;

// server a static page by default
app.use(express.static(__dirname));

// setting a basic pathg using the get method and servring the html file onto the server
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
    // checking for the connectiong if connection is perfectly done then we will display the message
    socket.on("chat message", (data) => {
        io.emit("chat message", {id: socket.id, msg: data});
    });

    socket.on("typing", (isTyping) => {
        // checking if some one is typing or not
        socket.broadcast.emit("typing", isTyping);
    });
    // when the server is disconnect we run a empty function
    socket.on("disconnect", () => {});
});

http.listen(PORT, () => {
    // connecting a port to the server
    console.log(`Server running at http://localhost:${PORT}`);
});
