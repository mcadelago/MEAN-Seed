var assert = require("assert"),
    http = require("http"),
    rest = require("restler"),
    models = require("../custom_modules/models"),
    app = require("../server");

var port = 1337,
    urlRemove = 'http://localhost:' + port + '/api/messages/_remove',
    urlSave = 'http://localhost:' + port + '/api/messages/_save',
    urlFind = 'http://localhost:' + port + '/api/messages/_find';




describe('API', function () {
    before(function (done) {
        app.start(port, 'test', done);
    });

    it('should be listening at localhost:' + port, function (done) {
        http.get('http://localhost:' + port + '/', function () {
            done();
        });
    });

    it('should accept find request', function (done) {
        rest.get('http://localhost:' + port + '/api/messages/_find')
            .on('complete', function () {
                done();
            });
    });

    it('should find documents based on query', function (done) {
        var data = {"Message": "find test", "User": "Find"};

        //add document to database to search for
        rest.put(urlSave, {data: data})
            .on('complete', function () {

                //retrieve document using input data as query string in URL
                rest.get(urlFind + '?conditions=' + JSON.stringify(data))
                    .on('complete', function (res) {

                        assert(res.length, 'no documents found based on query!');

                        //cleanup
                        rest.put(urlRemove, {data: data});
                        done();
                    });
            });
    });

    it('should accept insert request', function (done) {
        var data = {"Message": "testing!", "User": "Mike"};

        //save document to db
        rest.put(urlSave, {data: data})
            .on('complete', function () {

                //locate document to verify it was added
                rest.get(urlFind)
                    .on('complete', function (res) {
                        assert(res.length, 'no documents found!');

                        //cleanup
                        rest.put(urlRemove, {data: data});
                        done();
                    });
            });
    });

    it('should remove documents based on input conditions', function (done) {
        var data = {"Message": "removal test", "User": "Remove"};
        var keeper = {"Message": "don't remove me!", "User": "Save"};

        //save data to delete
        rest.put(urlSave, {data: data})
            .on('complete', function () {

                //save data to preserve
                rest.put(urlSave, {data: keeper})
                    .on('complete', function () {

                        //remove data to be deleted
                        rest.put(urlRemove, {data: data})
                            .on('complete', function () {

                                //check to see that correct data was removed
                                rest.get(urlFind)
                                    .on('complete', function (res) {
                                        var deleteMeData = res.filter(function (el) {
                                            return el.User == "Remove";
                                        });
                                        var keeperData = res.filter(function (el) {
                                            return el.User == "Save";
                                        });

                                        assert(!deleteMeData.length && keeperData, 'incorrect data in db!');

                                        //remove keeper data for cleanup
                                        rest.put(urlRemove, {data: keeper});

                                        done();
                                    });
                            });
                    });
            });
    });
});



