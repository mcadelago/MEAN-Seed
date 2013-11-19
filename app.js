var server = require('./server');

var db = 'meanchat'; //mongoDB database
var port = 3000;

server.start(port, db, function () {
    console.log('Express server listening on port ' + port);
});