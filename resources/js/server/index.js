const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 8001;

connected = [];

server.listen(port, () => {
    console.log(`Server is running in port ${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/resources/js/app.js');
});

io.on('connection', function(socket){
    connected.push(socket);
    console.log('user connected: ' + connected.length);

    socket.on('event', (data, sourceDroppable, destinationDroppable) => {
        // console.log(JSON.stringify(data));
        socket.broadcast.emit('event', data, sourceDroppable, destinationDroppable);
    });

    socket.on('update',()  => {
        socket.broadcast.emit('update');
    })

    socket.on('disconnect', function(data){
        connected.splice(connected.indexOf(socket), 1);
        console.log('user disconnected: ' + connected.length)
    })
})