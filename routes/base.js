var schema = require('../models/schema')

/** Helper to get Timestamp **/
var getTime = function () {
    var currentdate = new Date();
    return currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/"
                    + currentdate.getFullYear() + " @ "
                    + currentdate.getHours() + ":"
                    + currentdate.getMinutes() + ":"
                    + currentdate.getSeconds();
};

//GETS

var home = function (req, res) {
    schema.Person.find({}, null, {sort: {name: 1}}, function (err1, people_) {
        if (err1) {
            res.status(500).json({error: "Could not load users. \n" + err1})
            return;
        }
        schema.Twote.find({}, null, {sort: {timestamp: -1}}, function (err2, twotes_) {
            if (err2) {
                res.status(500).json({error: "Could not load twotes. \n" + err2})
                return;
            }
            var pageData = {
                  people: people_
                , twotes: twotes_
                , message: req.body.message
                , author: req.session.username
                , id: req.session.user
            };

            res.render('index', pageData);
        });
    });
};

// POSTS

var login = function (req, res) {
    schema.Person.find({name: req.body.username}, function (err, exist) {
        if (err || exist.length) {
            res.render('login', {message: err ? err : "Name already exists!"});
        } else {
            schema.Person({name: req.body.username}).save(function (err, data) {
                req.session.user = data._id;
                req.session.username = req.body.username ? req.body.username : "NewUser";
                res.redirect("/");
            });
        }
    });
};

var logout = function (req, res) {
    req.session.destroy();
    res.status(200).json({logout: true});
}

var delete_ = function (req, res) {
    schema.Twote.remove({}, function(Err) {
        schema.Person.remove({}, function(Err) {
            res.redirect('/');
        });
    });
}

var addTwote = function (req, res) {
    schema.Twote({
          timestamp: new Date().getTime()
        , displayTime: getTime()
        , author: req.session.username
        , authorId: req.session.user
        , message: req.body.message
    }).save(function (err, data) {
        if (err) {
            res.status(500).json({error: "Could not add Twote, " + err});
            return;
        }

        res.json(data);
    });
};

var deleteTwote = function (req, res) {
    console.log(req.body.id);
    schema.Twote.remove({_id: req.body.id}, function (err) {
        if (err) {
            res.status(500).json({error: "Could not delete Twote, " + err});
        } else {
            res.status(200).json({success: true});
        }
    });
}

/* Wraps the function in session checker */
var sessionWrapper = function (func) {
    return function (req, res) {
        if (req.session.username && req.session.user) {
            req.session.counter++;
            req.body.message = "Hello again! Thanks for visiting " + req.session.counter + " times";
        } else {
            req.session.counter = 1;
            res.render('login', {});
            return;
        }

        func(req, res);
    };
};



exports.home = sessionWrapper(home);
exports.login = login;
exports.logout = logout;
exports.addTwote = addTwote;
exports.delete_ = delete_;
exports.deleteTwote = deleteTwote;