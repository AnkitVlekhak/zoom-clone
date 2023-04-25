const express = require("express");
const app = express();
const ejs = require('ejs');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use('/peerjs', peerServer);



app.get("/", (req, res) => {
    res.redirect("" + uuidv4());
});

app.get("/:room", (req, res) => {
    res.render("room", { roomID: req.params.room });
})


io.on('connection', (socket) => {
    socket.on('join-room', (roomid, peerID) => {
        socket.join(roomid);
        socket.to(roomid).emit('user-connected', peerID);
        socket.on('message', (newMsg) => {
            socket.to(roomid).emit('createMessage', newMsg);
        })
        socket.on('disconnect', () => {//user tells to room that he has disconnected
            socket.to(roomid).emit('user-disconnected', peerID);

        })
    })
});

server.listen(process.env.PORT || 4000, () => {
    console.log("Server is up and running");
})