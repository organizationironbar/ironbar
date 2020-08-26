const mongoose = require('mongoose')
const User = require('../models/user.model')
const nodemailer = require('../config/mailer.config');
const passport = require('passport')

module.exports.init = (req, res, next) => {
    res.render('init')
}