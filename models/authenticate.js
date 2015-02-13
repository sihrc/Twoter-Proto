var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;
var secrets = require('../secrets');
var account = require('./account');

// config
module.exports.facebook = function(PORT) {
    passport.use(new FacebookStrategy({
            clientID: secrets.clientID,
            clientSecret: secrets.clientSecret,
            callbackURL: 'http://localhost:' + PORT + '/auth/facebook/callback'
        },
        function(accessToken, refreshToken, profile, done) {
            account.Person.findOne({
                 oauthID: profile.id
            }, function(err, user) {
                if (err) {
                    console.log(err);
                }
                if (!err && user != null) {
                    done(null, user);
                } else {
                    var user = new account.Person({
                        oauthID: profile.id,
                        name: profile.displayName,
                        created: Date.now()
                    });
                    user.save(function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("saving user ...");
                            done(null, user);
                        };
                    });
                };
            });
        }
    ));
}
module.exports.local = function() {
    passport.use(new LocalStrategy(
        function(username, password, done) {
            account.Person.findOne({
                name: username
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Incorrect username.'
                    });
                }
                if (!user.validPassword(password)) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
                return done(null, user);
            });
        }
    ));
}