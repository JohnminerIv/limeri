require('dotenv').config()
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);



io.on("connection", (socket) => {
    // This file will be read on new socket connections
    console.log('hello')
    require('./limeri/sockets.js')(io, socket);
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/html/index.html');
});


const limeriRoutes = require('./limeri/routes.js');
app.use('/limeri', limeriRoutes);


server.listen(process.env.PORT || 3000, () => {
    console.log(`Listening at http://${process.env.IP || 'localhost'}:${process.env.PORT || 3000}`);
});
