if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const server = require('express')();
const http = require('http').createServer(server);
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:8080"
    }
});

const players = {};
const roomLimit = 3;
const playerSlots = Array.from({ length: roomLimit }, (_, i) => (i + 1).toString());

getPlayerSlot = () => {
    let slot = Math.min.apply(Math, playerSlots).toString();
    playerSlots.splice(playerSlots.indexOf(slot), 1);
    return slot;
}

freePlayerSlot = (slot) => {
    playerSlots.push(slot);
}

io.on('connection', (socket) => {
    console.log(socket.id + " connected!");
    if (Object.keys(players).length === roomLimit) {
        socket.emit('roomIsFull');
        socket.disconnect();
    }
    else {
        socket.on('playerNew', (gameObj) => {
            players[gameObj.id] = gameObj;
            socket.broadcast.emit('playerNew', gameObj);
        });

        socket.emit('fetchPlayers', players);

        socket.emit('assignPlayerId', socket.id, getPlayerSlot());

        socket.on('playerMove', (id, direction) => {
            io.emit('playerMove', id, direction);
        });

        socket.on('disconnect', () => {
            console.log(socket.id + " disconnected.");
            freePlayerSlot(players[socket.id].slot);
            delete players[socket.id];
            io.emit('playerRemove', socket.id);
        });
    }
});



const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
    console.log("Server listenint on port: " + PORT);
});
