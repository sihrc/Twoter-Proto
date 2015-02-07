// Utility Imports
var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
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

// Routing Table
app.get('/', base.home);
app.get('/delete', base.delete_);

// POSTS
app.post('/login', base.login);
app.post('/logout', base.logout);
app.post('/addTwote', base.addTwote);
app.post('/deleteTwote', base.deleteTwote);

// Listen
app.listen(PORT);
