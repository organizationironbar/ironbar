require('dotenv').config()
const express = require('express')
const path = require('path')
const logger = require('morgan')
var cookieParser = require('cookie-parser')
require('./config/db.config')
require('./config/hbs.config')

const passport = require('./config/passport.config')
const session = require('./config/session.config')

const app = express()

/** Middlewares */
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(logger("dev"))
app.use(cookieParser())
app.use(session)
app.use(passport)
app.use(( req, res, next ) => {
    res.locals.MAPS_API_KEY = process.env.MAPS_API_KEY
    next()

})

    //******/

/** View engine setup */
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
    //******/


/** Configure Routes */
const router = require('./config/routes.js')
app.use('/', router)
    /*****/

app.listen(process.env.PORT || 3000, () => {
    console.log(`Ready!`)
})