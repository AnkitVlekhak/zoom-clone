const socket = io("/");

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030'
});



const myVideo = document.createElement("video");
myVideo.muted = true;
var videoGrid = document.getElementById("video-grid");
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then((stream) => {
    addVideo(myVideo, stream);
});



peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})

peer.on('call', (call) => {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then((stream) => {

        call.answer(stream);
        const video = document.createElement("video");
        call.on('stream', (remoteStream) => {
            addVideo(video, remoteStream);
        });
    })
});

socket.on('user-connected', (userId) => {
    connectToNewUser(userId);
})

const connectToNewUser = (userId) => {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then((stream) => {
        const call = peer.call(userId,
            stream);
        const video = document.createElement("video");
        call.on('stream', function (remoteStream) {
            addVideo(video, remoteStream);
        });
    })
}

const addVideo = (video, mediaStream) => {
    video.srcObject = mediaStream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}