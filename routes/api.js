//var dblink = require('../custom_modules/dbLink'),
var models = require('../custom_modules/models'),
    socket = require('../custom_modules/sockets');

/*
 * Serve JSON to our AngularJS client
 */

var getModel = function (collection) {
    var model;
    for (var key in models) {
        if (models[key].collection.name == collection) model = models[key];
    }
    return model;
};


exports.find = function (req, res) {

    //determine model to use for find operation
    var model = getModel(req.params.collection);
    if (!model) res.send(500, 'invalid collection!');

    //parse query (if any) for filtering search results
    var conditions = req.query.conditions ? JSON.parse(req.query.conditions) : null;
    var fields = req.query.fields ? JSON.parse(req.query.fields) : null;
    var options = req.query.options ? JSON.parse(req.query.options) : null;

    model.find(conditions, fields, options, function (err, body) {
        if (err) res.send(500, err);
        else res.json(body);
    });
};


exports.upsert = function (req, res) {
    var conditions = req.body.conditions;
    var data = req.body.data;
    var model = getModel(req.params.collection);

    if (!model) res.send(500, 'invalid collection!');
    else {
        model.update(conditions, data, {upsert: true}, function (err) {
            if (err) res.send(500, 'upsert failed!');
            else {
                res.send(200);
                socket.io.sockets.emit(req.params.collection + ':update');
            }
        });
    }
};

exports.save = function (req, res) {
    var data = req.body;
    var model = getModel(req.params.collection);

    if (!model) res.send(500, 'invalid collection!');
    else {
        var m = new model(data);
        m.save(function (err) {
            if (err) res.send(500, 'document save failed!');
            else {
                res.send(200);
                socket.io.sockets.emit(req.params.collection + ':update');
            }
        });
    }
};

exports.remove = function (req, res) {
    var data = req.body;
    var model = getModel(req.params.collection);
    if (!model) res.send(500, 'invalid collection!');

    else {
        if (!data) res.send(500, 'must have conditions for remove operation');
        else {
            model.remove(data, function (err) {
                if (err) res.send(500, 'unable to remove documents');
                else {
                    res.send(200);
                    socket.io.sockets.emit(req.params.collection + ':update');
                }
            });
        }
    }
};