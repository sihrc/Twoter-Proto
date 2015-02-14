var mongoose = require('mongoose');

var account_schema = mongoose.Schema({
      name: String
    , oauthID: String
    , created: String
});

exports.Person = mongoose.model('account', account_schema);
