const mongoose = require("mongoose");
const User = require("../models/user.model");
const nodemailer = require("../config/mailer.config");

function validateData(userParams) {
    if (userParams.type === "stablishment") {
        if (!userParams.addressnew) {
            console.log("1");
            return "NOK";
        } else {
            console.log("2");
            return "OK";
        }
    } else if (userParams.type === "user" && !userParams.addressnew) {
        console.log("3");
        return "OK";
    }
}

module.exports.init = (req, res, next) => {
    res.render("init");
};

module.exports.signup = (req, res, next) => {
    res.render("users/signup");
};

//TODO: REVISAR FORMAT DIRECCIONES
function formatUser(userToFormat) {
    console.log("userToFormat: " + JSON.stringify(userToFormat));
    var parsedAddress = userToFormat.addressnew.split(",");
    var streetNum, streetName, zipCode, city, zc;
    var split_string;
    parsedAddress.length >= 3 ?
        (split_string = parsedAddress[2].trim().split(/(\d+)/)) :
        (split_string = ["", "0000", "Unknown City"]);
    // split_string = split_string[2].replace(/^ /, '');
    if (parsedAddress.length === 4) {
        streetNum = parsedAddress[1];
        streetName = parsedAddress[0];
        zipCode = split_string[1];
        city = split_string[2];
    } else if (parsedAddress.length === 3) {
        streetNum = 0;
        streetName = parsedAddress[0];
        zipCode = split_string[1];
        city = split_string[2];
    } else {
        streetNum = 0;
        streetName = parsedAddress[0];
        zipCode = "0000";
        city = parsedAddress[1];
    }

    var latlong = userToFormat.latlong.split(",");
    let newUser;
    if (userToFormat.type === "stablishment") {
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
                lat: latlong[0],
                lng: latlong[1],
            },
            city: city,
            address: streetName,
            number: streetNum != undefined ? streetNum : 0,
            zipCode: zipCode,
        };
    } else {
        newUser = {
            type: userToFormat.type,
            name: userToFormat.name,
            email: userToFormat.email,
            phone: userToFormat.phone,
            avatar: userToFormat.avatar,
            password: userToFormat.password,
            bio: userToFormat.bio,
        };
    }
    console.log("newUserFormatting: " + JSON.stringify(newUser));
    return newUser;
}

module.exports.activateUser = (req, res, next) => {
    User.findOne({ "activation.token": req.params.token })
        .then((user) => {
            if (user) {
                user.activation.active = true;
                user
                    .save()
                    .then((user) => {
                        res.render("users/login", {
                            message: "Your account has been activated, log in below!",
                        });
                    })
                    .catch((e) => next);
            } else {
                res.render("users/login", {
                    error: {
                        validation: {
                            message: "Invalid link",
                        },
                    },
                });
            }
        })
        .catch((e) => next);
};

module.exports.logout = (req, res, next) => {
    req.session.destroy();

    res.redirect("/login");
};

module.exports.doSocialLoginSlack = (req, res, next) => {
    const passportController = passport.authenticate("slack", (error, user) => {
        if (error) {
            next(error);
        } else {
            req.session.userId = user._id;
            res.redirect("/");
        }
    });

    passportController(req, res, next);
};

module.exports.doSocialLoginGoogle = (req, res, next) => {
    const passportController = passport.authenticate("google", (error, user) => {
        if (error) {
            next(error);
        } else {
            req.session.userId = user._id;
            res.redirect("/");
        }
    });

    passportController(req, res, next);
};

module.exports.doSocialLoginInstagram = (req, res, next) => {
    const passportController = passport.authenticate(
        "instagram",
        (error, user) => {
            if (error) {
                next(error);
            } else {
                req.session.userId = user._id;
                res.redirect("/stablishments/list");
            }
        }
    );

    passportController(req, res, next);
};

module.exports.doSocialLoginFacebook = (req, res, next) => {
    const passportController = passport.authenticate(
        "facebook",
        (error, user) => {
            if (error) {
                next(error);
            } else {
                req.session.userId = user._id;
                res.redirect("/stablishments/list");
            }
        }
    );

    passportController(req, res, next);
};

module.exports.login = (req, res, next) => {
    res.render("users/login");
};

module.exports.signupType = (req, res, next) => {
    console.log("SIGNUPTYPE: " + JSON.stringify(req.body));
    if (req.body.type) {
        res.render("users/signup", { type: req.body.type });
    } else {
        res.render("users/signupType");
    }
};

module.exports.doLogin = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                user.checkPassword(req.body.password).then((match) => {
                    if (match) {
                        if (user.activation.active) {
                            req.session.userId = user._id;

                            res.redirect("/stablishments/list");
                        } else {
                            res.render("users/login", {
                                error: {
                                    validation: {
                                        message: "Your account is not active, check your email!",
                                    },
                                },
                            });
                        }
                    } else {
                        res.render("users/login", {
                            error: {
                                email: {
                                    message: "user not found",
                                },
                            },
                        });
                    }
                });
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
        .catch(next);
};

module.exports.activateUser = (req, res, next) => {
    User.findOne({ _id: req.params.id, "activation.token": req.params.token })
        .then((user) => {
            if (user) {
                user.activation.active = true;

                user
                    .save()
                    .then((user) => {
                        res.render("users/login", {
                            message: "Your account has been activated, log in below!",
                        });
                    })
                    .catch((e) => next);
            } else {
                res.render("users/login", {
                    error: {
                        validation: {
                            message: "Invalid link",
                        },
                    },
                });
            }
        })
        .catch((e) => next);
};

// CRUD

module.exports.createUser = (req, res, next) => {
    const userParams = req.body;
    var isValid = validateData(userParams);
    if (isValid === "NOK") {
        res.render("users/signup");
    } else {
        let newUserP;
        //userParams.avatar = req.file ? `/uploads/${req.file.filename}` : undefined;
        userParams.avatar = req.file ? req.file.path : undefined
        if (userParams.type === "stablishment") {
            console.log("type: stablishment");
            newUserP = formatUser(userParams);
        } else {
            console.log("else");
            newUserP = userParams;
        }
        const user = new User(newUserP);

        user
            .save()

        .then((user) => {
                nodemailer.sendValidationEmail(
                    user.name,
                    user.email,
                    user._id,
                    user.activation.token
                );
                res.render("users/login", {
                    message: "Check your email for activation",
                });
            })
            .catch((error) => {
                console.log("holaerrormongo");
                if (error instanceof mongoose.Error.ValidationError) {
                    console.log("holaerrormongo1");

                    res.render("users/signup", { error: error.errors, user });
                } else if (error.code === 11000) {
                    // error when duplicated user
                    console.log("holaerrormongo12");

                    res.render("users/signup", {
                        user,
                        error: {
                            email: {
                                message: "user already exists",
                            },
                        },
                    });
                } else {
                    console.log("holaerrormongo3");

                    next(error);
                }
            })
            .catch(next);
    }
};

module.exports.show = (req, res, next) => {
    User.findById(req.params.id)
        .populate("comments")
        .populate("likes")
        .then((user) => {
            var location
            if (user.type === 'stablishment') {
                var lat = Number(user.location.lat)
                var lng = Number(user.location.lng)
                location = { lat, lng }

            } else location = null
            res.render("users/show", { user, location });
        })
        .catch(next);
};

module.exports.edit = (req, res, next) => {
    User.findById(req.params.id)
        .then((user) => {
            res.render("users/edit", { user });
        })
        .catch(next);
};

module.exports.update = (req, res, next) => {
    const body = req.body;

    if (req.file) {
        body.avatar = req.file.path;
    }

    User.findByIdAndUpdate(req.params.id, body, {
            runValidators: true,
            new: true,
        })
        .then((user) => {
            if (user) {
                res.redirect(`/users/${user._id}`);
            } else {
                res.redirect("/stablishments/list");
            }
        })
        .catch(next);
};

module.exports.delete = (req, res, next) => {
    if (req.params.id.toString() === req.currentUser.id.toString()) {
        req.currentUser
            .remove()
            .then(() => {
                req.session.destroy();
                res.redirect("/login");
            })
            .catch(next);
    } else {
        res.redirect("/stablishments/list");
    }
};

module.exports.logout = (req, res, next) => {
    req.session.destroy();

    res.redirect("/login");
};

// module.exports.show = (req, res, next) => {
//     User.findById(req.params.id)
//         .populate("comments")
//         .populate("likes")
//         .then((user) => {
//             res.render("users/show", { user });
//         })
//         .catch(next);
// };