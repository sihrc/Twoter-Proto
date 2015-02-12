var mongoose = require('mongoose');

var account_schema = mongoose.Schema({
    name: String
});


exports.Person = mongoose.model('account', account_schema);