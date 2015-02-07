var mongoose = require('mongoose');

var people_schema = mongoose.Schema({
    name: String
});

var twote_schema = mongoose.Schema({
      timestamp:    Number
    , displayTime:  String
    , author:       String
    , authorId:     String
    , message:      String
});

exports.Person = mongoose.model('person', people_schema);
exports.Twote = mongoose.model('twote', twote_schema);