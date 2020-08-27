const User = require('../models/user.model')
const Stablishment = require()

module.exports.isAuthenticated = (req, res, next) => {
    User.findById(req.session.userId)
        .then(user => {
            if (user) {
                req.currentUser = user
                res.locals.currentUser = user

                next()
            } else {
                res.redirect('/init')
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
                res.redirect("/");
            } else {
                next();
            }
        })
        .catch(next);
};