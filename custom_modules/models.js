var mongoose = require('mongoose');

exports.Message = mongoose.model('Message',
    {
        User: String,
        Message: String,
        TimeStamp: Date
    });

exports.User = mongoose.model('User',
    {
        Name: String,
        ID: String
    });