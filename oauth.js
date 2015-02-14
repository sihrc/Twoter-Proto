var facebook = {
 clientID: 'get_your_own',
 clientSecret: 'get_your_own',
 callbackURL: function (PORT) {return 'http://localhost:'+ PORT + '/auth/facebook/callback'}
};



exports.facebook = facebook;