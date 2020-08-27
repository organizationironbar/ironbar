const passport = require("passport");
const User = require("../models/user.model");

const SlackStrategy = require("passport-slack").Strategy;
var InstagramStrategy = require('passport-instagram').Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const randomPassword = () => Math.random().toString(36).substring(7)

const slack = new SlackStrategy({

        clientID: process.env.SLACK_CLIENT_ID,
        clientSecret: process.env.SLACK_CLIENT_SECRET,
        callbackUrl: "/auth/slack",

    },
    (accessToken, refreshToken, profile, next) => {
        User.findOne({ "social.slackID": profile.id })
            .then((user) => {
                if (user) {
                    next(null, user);
                } else {
                    const newUser = new User({
                        name: profile.displayName,
                        email: profile.user.email,
                        avatar: profile.user.image_1024,
                        password: profile.provider + randomPassword(),
                        social: {
                            slack: profile.id,
                        },
                        activation: {
                            active: true
                        }
                    });

                    newUser
                        .save()
                        .then((user) => {
                            next(null, user);
                        })
                        .catch((err) => next(err));
                }
            })
            .catch((err) => next(err));
    }
);


const google = new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
        // to see the structure of the data in received response:
        console.log("Google account details:", profile);

        User.findOne({ email: profile.emails[0].value })
            .then(user => {

                if (user) {
                    done(null, user);
                    return;
                } else {
                    const newUser = new User({
                        googleID: profile.id,
                        name: profile.displayName,
                        username: profile.emails[0].value.split("@")[0],
                        email: profile.emails[0].value,
                        avatar: profile._json.picture,
                        password: profile.provider + Math.random().toString(36).substring(7),
                        googleID: profile.id,

                    });
                    newUser
                        .save()
                        .then((user) => {
                            done(null, user);
                        })
                        .catch((err) => done(err));
                }
            })
            .catch(err => done(err)); // closes User.findOne()
    }
)

passport.serializeUser(function(user, next) {
    next(null, user);
});
passport.deserializeUser(function(user, next) {
    next(null, user);
});

passport.use(google)
passport.use(slack)

module.exports = passport.initialize()