var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var schema = require('./models/schema');

if (!process.env.facebookID) {
    var secrets = require('./secrets.js');
}

exports.serialize = function (user, done) {
    done(null, user);
};

exports.deserialize = function (obj, done) {
    done(null, obj);
};

exports.local = new LocalStrategy(
    function(username, password, done) {
        schema.Person.findOne({
            username: username
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                schema.Person({
                    username: username,
                    password: password
                }).save(function(err, user) {
                    if (err) {
                        return done(null, false, {
                            message: 'Incorrect password'
                        });
                    }
                    return done(null, user);
                });
            } else if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            } else {
                return done(null, user);
            }
        });
    });

exports.facebook = function(port) {
    return new FacebookStrategy({
        clientID: process.env.facebookID || secrets.clientID,
        clientSecret: process.env.facebookSecret || secrets.clientSecret,
        callbackURL: process.env.facebookCallback || ("http://localhost:" + port + "/auth/facebook/callback")
    }, function(accessToken, refreshToken, profile, done) {
        schema.Person.findOne({
            password: profile.id
        }, function(err, user) {
            if (!user) {
                schema.Person({
                    username: "fbUser-"
                        + profile.name.givenName
                        + ((profile.name.middleName) ? "-" + profile.name.middlename + "-" : "-")
                        + profile.name.familyName,
                    password: profile.id
                }).save(function(err, user) {
                    return done(null, user);
                });
            } else {
                return done(null, user);
            }
        });
    });
};