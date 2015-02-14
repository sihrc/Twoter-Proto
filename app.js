// Utility Imports
var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var passport = require('passport');
var authenticate = require('./models/authenticate');
var hbs = exphbs.create({
      defaultLayout: 'base'
    , partialsDir: __dirname + '/views/partials'
    , layoutsDir: __dirname + '/views/layouts'
    // Specify helpers which are only registered on this instance.
    , helpers: {
        equal: function(lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if( lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
});

// Route Imports
var base = require('./routes/base');

// Config
var app = express();
var mongoURI = process.env.MONGOURI || "mongodb://localhost/twoter";
var PORT = process.env.PORT || 3000;
mongoose.connect(mongoURI);

app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));
app.engine('handlebars', hbs.engine);

// Middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(passport.session());

authenticate.facebook(PORT);
authenticate.local();

// serialize and deserialize
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// Routing Table
app.get('/', base.home);
app.get('/delete', base.delete_);
app.get('/account', ensureAuthenticated, function(req, res) {
    console.log(req.sessionStore);
    res.redirect('/');
});

app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : '/account',
        failureRedirect : '/login'
    }));

// POSTS
app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);
app.post('/logout', base.logout);
app.post('/addTwote', base.addTwote);
app.post('/deleteTwote', base.deleteTwote);

// Listen
app.listen(PORT);

// test authentication
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
