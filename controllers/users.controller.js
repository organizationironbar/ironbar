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
      if(req.body.type){
        res.render('users/signup', { type : req.body.type })
      }else{
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