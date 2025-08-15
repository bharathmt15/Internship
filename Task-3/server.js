const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const documents = {}; // { docId: { content, editors: [] } }

const upload = multer({dest: "uploads/"});

// Upload file route
app.post("/upload", upload.single("file"), async (req, res) => {
    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let content = "";

    try {
        if (ext === ".pdf") {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdfParse(dataBuffer);
            content = data.text;
        } else if (ext === ".docx" || ext === ".doc") {
            const data = await mammoth.extractRawText({path: filePath});
            content = data.value;
        } else {
            content = fs.readFileSync(filePath, "utf-8");
        }
    } catch (err) {
        console.log(err);
        content = "";
    }

    const docId = Math.random().toString(36).substring(2, 10);
    documents[docId] = {content, editors: []};

    fs.unlinkSync(filePath);
    res.json({docId, content});
});

// Socket.IO real-time
io.on("connection", (socket) => {
    socket.on("join-doc", ({docId, username}) => {
        socket.join(docId);
        if (!documents[docId]) documents[docId] = {content: "", editors: []};
        documents[docId].editors.push(username);

        // Send initial content + editors
        socket.emit("load-doc", documents[docId].content);
        io.to(docId).emit("editors-update", documents[docId].editors);

        // Listen for edits
        socket.on("edit-doc", (data) => {
            documents[docId].content = data;
            socket.to(docId).emit("update-doc", data);
        });

        // Handle disconnect
        socket.on("disconnect", () => {
            const index = documents[docId]?.editors.indexOf(username);
            if (index !== -1) {
                documents[docId].editors.splice(index, 1);
                io.to(docId).emit("editors-update", documents[docId].editors);
            }
        });
    });
});

server.listen(4000, () =>
    console.log("Server running on http://localhost:4000")
);
