const fs = require('fs');
const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { Server } = require('socket.io');
const conf = JSON.parse(fs.readFileSync("./conf.json"));

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);

app.use("/", express.static(path.join(__dirname, "public")));
const server = http.createServer(app);
server.listen(conf.port, () => {
    console.log("- server running");
});

const io = new Server(server);

let userList = [];

io.on('connection', (socket) => {
    console.log("socket connected: " + socket.id);
    io.emit("chat", "new client: " + socket.id);

    socket.on("setUsername", (username) => {
        userList.push({
            socketId: socket.id,
            name: username
        });
        io.emit("list", userList);
        io.emit("chat", `${username} si è unito alla chat!`);
    });
    
    socket.on('message', (message) => {
        const user = userList.filter(u => u.socketId === socket.id)[0];
        const response = user.name + ': ' + message;
        console.log(response);
        io.emit("chat", response);
    });

    socket.on("disconnect", () => {
        const user = userList.filter(u => u.socketId === socket.id)[0];
        if (user) {
            console.log(`${user.name} si è disconnesso.`);
            userList = userList.filter(u => u.socketId !== socket.id);
            io.emit("list", userList);
            io.emit("chat", `${user.name} ha lasciato la chat.`);
        }
    });
});