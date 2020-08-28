const mongoose = require('mongoose')
const User = require('../models/user.model')
const nodemailer = require('../config/mailer.config');
const passport = require('passport')

module.exports.init = (req, res, next) => {
    res.render('init')
}

module.exports.createUser = (req, res, next) => {

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

//   module.exports.doSocialLoginInstagram = (req, res, next) => {
//     const passportController = passport.authenticate("instagram", (error, user) => {
//       if (error) {
//         next(error);
//       } else {
//         req.session.userId = user._id;
//         res.redirect("/");
//       }
//     })
  
//     passportController(req, res, next);
//   }

  module.exports.doSocialLoginFacebook = (req, res, next) => {
    const passportController = passport.authenticate("facebook", (error, user) => {
      if (error) {
        next(error);
      } else {
        req.session.userId = user._id;
        res.redirect("/");
      }
    })
  
    passportController(req, res, next);
   
  }

