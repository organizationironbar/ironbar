const mongoose = require('mongoose')
const User = require('../models/user.model')
const nodemailer = require('../config/mailer.config');

function validateData(userParams) {
    if (userParams.type === 'stablishment') {
        if (!userParams.addressnew)
            return 'NOK'
        else
            return 'OK'
    } else if (userParams.type === 'user' && !userParams.addressnew)
        return 'OK'
}


module.exports.init = (req, res, next) => {
    res.render('init')
}

module.exports.signup = (req, res, next) => {
    res.render('users/signup')
}

function formatUser(userToFormat) {
    var parsedAddress = userToFormat.addressnew.split(',')
    var streetNum, streetName, zipCode, city, zc
    zc = parsedAddress[2].split(' ')
    if (parsedAddress.length === 4) {
        streetNum = parsedAddress[1]
        streetName = parsedAddress[0]
        zipCode = zc[0]
        city = zc[1]
    } else if (parsedAddress.length === 3) {
        streetNum = 0
        streetName = parsedAddress[0]
        zipCode = zc[0]
        city = zc[1]
    } else {
        streetNum = 0
        streetName = parsedAddress[0]
        zipCode = '0000'
        city = parsedAddress[1]
    }

    var latlong = userToFormat.latlong.split(',')
    let newUser
    if (userToFormat.type === 'stablishment') {
        newUser = {
            type: userToFormat.type,
            name: userToFormat.name,
            email: userToFormat.email,
            password: userToFormat.password,
            contactEmail: userToFormat.contactEmail,
            phone: userToFormat.phone,
            avatar: userToFormat.avatar,
            bio: userToFormat.bio,

            category: userToFormat.category,
            location: {
                location: {
                    lat: latlong[0],
                    lng: latlong[1],
                },
                city: city,
                address: streetName,
                number: streetNum != undefined ? streetNum : 0,
                zipCode: zipCode,
            }
        }
    } else {
        newUser = {
            type: userToFormat.type,
            name: userToFormat.name,
            email: userToFormat.email,
            phone: userToFormat.phone,
            avatar: userToFormat.avatar,
            password: userToFormat.password,
            bio: userToFormat.bio,
        }
    }
    console.log("newUserFormatting: " + JSON.stringify(newUser))
    return newUser

}

module.exports.createUser = (req, res, next) => {
    const userParams = req.body;
    var isValid = validateData(userParams)
    if (isValid === 'NOK') {
        res.render("users/signup");

    } else {
        userParams.avatar = req.file ? `/uploads/${req.file.filename}` : undefined;
        const newUserP = formatUser(userParams)
        const user = new User(newUserP);

        user.save()
            .then(user => {
                nodemailer.sendValidationEmail(user.email, user.activation.token, user.name);
                res.render('users/login', {
                    message: 'Check your email for activation'
                })
            })
            .catch((error) => {
                if (error instanceof mongoose.Error.ValidationError) {
                    res.render("users/signup", { error: error.errors, user });
                } else if (error.code === 11000) { // error when duplicated user
                    res.render("users/signup", {
                        user,
                        error: {
                            email: {
                                message: 'user already exists'
                            }
                        }
                    });
                } else {
                    next(error);
                }
            })
            .catch(next)
    }
}

module.exports.activateUser = (req, res, next) => {
    User.findOne({ "activation.token": req.params.token })
        .then(user => {
            if (user) {
                user.activation.active = true;
                user.save()
                    .then(user => {
                        res.render('users/login', {
                            message: 'Your account has been activated, log in below!'
                        })
                    })
                    .catch(e => next)
            } else {
                res.render('users/login', {
                    error: {
                        validation: {
                            message: 'Invalid link'
                        }
                    }
                })
            }
        })
        .catch(e => next)
}

module.exports.logout = (req, res, next) => {
        req.session.destroy()

        res.redirect('/login')
    }
    // module.exports.doCreateUser = (req, res, next) => {
    //     var newUser = req.params.
    //     if req.params.stablishmnet
    //     location

//     save

// }

module.exports.doSocialLoginSlack = (req, res, next) => {
    const passportController = passport.authenticate("slack", (error, user) => {
        if (error) {
            next(error);
        } else {
            req.session.userId = user._id;
            res.redirect("/");
        }
    })

    passportController(req, res, next);
}

module.exports.doSocialLoginGoogle = (req, res, next) => {
    const passportController = passport.authenticate("google", (error, user) => {
        if (error) {
            next(error);
        } else {
            req.session.userId = user._id;
            res.redirect("/");
        }
    })

    passportController(req, res, next);
}

module.exports.doSocialLoginInstagram = (req, res, next) => {
    const passportController = passport.authenticate("instagram", (error, user) => {
        if (error) {
            next(error);
        } else {
            req.session.userId = user._id;
            res.redirect("/stablishment/list");
        }
    })

    passportController(req, res, next);
}

module.exports.doSocialLoginFacebook = (req, res, next) => {
    const passportController = passport.authenticate("facebook", (error, user) => {
        if (error) {
            next(error);
        } else {
            req.session.userId = user._id;
            res.redirect("/stablishment/list");
        }
    })

    passportController(req, res, next);

}

module.exports.login = (req, res, next) => {
    res.render('users/login')
}

module.exports.signupType = (req, res, next) => {
    if (req.body.type) {
        res.render('users/signup', { type: req.body.type })
    } else {
        res.render('users/signupType')
    }

}

module.exports.doLogin = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                user.checkPassword(req.body.password)
                    .then(match => {
                        if (match) {
                            if (user.activation.active) {
                                req.session.userId = user._id

                                res.redirect('/stablishment/list')
                            } else {
                                res.render('users/login', {
                                    error: {
                                        validation: {
                                            message: 'Your account is not active, check your email!'
                                        }
                                    }
                                })
                            }
                        } else {
                            res.render('users/login', {
                                error: {
                                    email: {
                                        message: 'user not found'
                                    }
                                }
                            })
                        }
                    })
            } else {
                res.render("users/login", {
                    error: {
                        email: {
                            message: "user not found",
                        },
                    },

                });
            }
        })
        .catch(next)
}