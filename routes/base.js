var schema = require('../models/schema')

//GETS

var home = function (req, res) {
    schema.Person.find({}, function (people_, err1) {
        if (err1) {
            res.status(500).json({error: "Could not load users. \n" + err1})
        }
        schema.Twote.find({}, function (twotes_, err2) {
            if (err2) {
                res.status(500).json({error: "Could not load twotes. \n" + err2})
            }
            var pageData = {
                  people: people_
                , twotes: twotes_
                , message: req.body.message
            };

            res.render('index', pageData);
        });
    });
};

// POSTS

var login = function (req, res) {
    res.render('index');
}

/* Wraps the function in session checker */
var sessionWrapper = function (func) {
    return function (req, res) {
        if (req.session.counter) {
            req.session.counter++;
            req.body.message = "Hello again! Thanks for visiting " + req.session.counter + " times";
        } else {
            message = "Hello, thanks for visiting this site!";
            req.session.counter = 1;
            res.render('login', {});
            return;
        }

        func(req, res);
    };
}

exports.home = sessionWrapper(home);
exports.home = login;