// limeri/sockets.js
let Board = require('./game.js')

let boards = {}

module.exports = (io, socket) => {
    //Future socket listeners will be here

    socket.on('disconnecting', () => {
        socket.rooms.forEach((room) => {
            if (room !== socket.id) {
                delete boards[room].players[socket.id]
            }
        });
    });

    socket.on('create game', (data) => {
        if (boards[data['board name']] === undefined) {
            boards[data['board name']] = new Board();
            boards[data['board name']].playerCreate(data['name'], data['color'], socket.id);
            boards[data['board name']].playerCreate('test', '#00ffff', 'nfjsncosn;al');
            socket.join(data['board name'])
        }
    });

    socket.on('join game', (data) => {
        boards[data['board name']].playerCreate(data['name'], data['color'], socket.id)
        socket.join(data['board name'])
    });

    socket.on('move', (data) => {
        boards[data['board name']].playerMove(socket.id, data['direction'])
    });
    socket.on('shoot', (data) => {
        boards[data['board name']].playerShoot(socket.id, data['vector'])
    });



    setInterval(function () {
        for (const board in boards) {
            boards[board].stepProjectiles()
            // console.log(boards[board].display())
            io.to(board).emit('draw', boards[board].display())
        }
    }, 20);
}
