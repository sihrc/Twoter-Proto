var mongoose = require('mongoose');

var twote_schema = mongoose.Schema({
      timestamp:    Number
    , displayTime:  String
    , author:       String
    , authorId:     String
    , message:      String
});

exports.Twote = mongoose.model('twote', twote_schema);