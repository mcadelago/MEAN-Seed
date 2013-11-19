var socketio = require('socket.io');

exports.listen = function (server) {
    var io = socketio.listen(server);
    var count = 1;
    io.sockets.on('connection', function (socket) {


        socket.emit('news', {hello: 'world'});
        socket.on('my other event', function (data) {
            console.log(data);
        });

        socket.emit('count', {counter: count});
        socket.on('add', function () {
            count++;
            socket.broadcast.emit('count:update', {counter: count});
            exports.broadcast(null, null);
        });
    });
    exports.io = io;
};





