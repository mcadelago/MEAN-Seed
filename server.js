/**
 * Module dependencies
 */

var express = require('express'),
    routes = require('./routes'),
    api = require('./routes/api'),
    http = require('http'),
    path = require('path'),
    mongoose = require('mongoose'),
    io = require('./custom_modules/sockets');

var app = module.exports = express();

/**
 * Configuration
 */

// all environments
//app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
//app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);


/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);
app.get('/partials/:dir/:name', routes.partialsSub);

// JSON API
app.get('/api/:collection/_find', api.find);
app.put('/api/:collection/_upsert', api.upsert);
app.put('/api/:collection/_save', api.save);
app.put('/api/:collection/_remove', api.remove);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

//socket.IO implementation
var server = http.createServer(app);
io.listen(server);


/**
 * Start and Stop Server Exports
 */

module.exports.start = function (serverPort, db, callback) {

    // connect to database
    mongoose.connect('mongodb://localhost/' + db, {'poolSize': 5, 'auto_reconnect': true});

    //start server
    server.listen(serverPort, function () {
        callback();
    });
};

module.exports.stop = function () {
    server.stop();
};
