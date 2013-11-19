'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
    controller('AppCtrl', function ($scope, $http) {
        //main app controller code here

    }).
    controller('MyCtrl1', function ($scope, Messages) {

        //connect to socket.io service
        var socket = io.connect('http://localhost');

        var getMessages = function () {
            Messages.get(function (err, data) {
                if (err) console.log(err);
                $scope.messages = data;
            });
        };

        //subscribe to message updates and grab latest on event
        socket.on('messages:update', function () {
            getMessages();
        });

        $scope.send = function () {
            var m = new Messages.model();
            m.User = $scope.user;
            m.Message = $scope.message;
            Messages.send(m, function (err) {
                if (err) console.log(err);
            });

        };

        getMessages();

    }).
    controller('MyCtrl2', function ($scope) {
    // write Ctrl here

    });
