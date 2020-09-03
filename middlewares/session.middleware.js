const User = require('../models/user.model')


module.exports.isAuthenticated = (req, res, next) => {
    User.findById(req.session.userId)
        .then(user => {
            if (user) {
                req.currentUser = user
                res.locals.currentUser = user

                next()
            } else {
                res.redirect('/login')
            }
        })
        .catch(next);

}

module.exports.isAuthenticatedAsStablishment = (req, res, next) => {
    User.findById(req.session.userId)
        .then(user => {
            if (user.type === 'stablishment') {
                req.currentUser = user
                res.locals.currentUser = user

                next()
            } else {
                res.redirect('/init')
            }
        })
        .catch(next);

}

module.exports.isNotAuthenticated = (req, res, next) => {
    User.findById(req.session.userId)
        .then((user) => {
            if (user) {
                res.redirect("/stablishment/list");
            } else {
                next();
            }
        })
        .catch(next);
};

module.exports.userType = (req, res, next) => {
    console.log("desde middleware" + JSON.stringify(req.body))

    if (req.body.type) {
        res.render("/users/signup", { type: req.body.type });
    } else {
        res.redirect("/login");
    }


};