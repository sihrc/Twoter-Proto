var mongoose = require('mongoose');

var people_schema = mongoose.Schema({
      username: String
    , password: String
});

people_schema.methods.validPassword = function (pwd) {
    return (this.password == pwd);
}

var twote_schema = mongoose.Schema({
      timestamp:    Number
    , displayTime:  String
    , author:       String
    , message:      String
});

exports.Person = mongoose.model('person', people_schema);
exports.Twote = mongoose.model('twote', twote_schema);