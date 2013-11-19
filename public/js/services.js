'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
    .value('version', '0.1')

    .factory('Messages', function ($http) {
        var Messages = {};

        Messages.get = function (callback) {
            $http.get('/api/messages/_find')
                .success(function (data) {
                    callback(null, data);
                })
                .error(function (err) {
                    callback(err);
                });
        };

        Messages.send = function (message, callback) {
            $http.put('/api/messages/_save', message)
                .success(function () {
                    callback();
                })
                .error(function (err) {
                    callback(err);
                });
        };

        Messages.model = function () {
            this.User = String;
            this.Message = String;
        };

        return Messages;
    });
