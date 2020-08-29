const passport = require("passport");
const User = require("../models/user.model");
const FacebookStrategy = require('passport-facebook').Strategy

const SlackStrategy = require("passport-slack").Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
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
        callbackURL: "/auth/google",
        scope: ['https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email']
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


const facebook = new FacebookStrategy({

    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "/auth/facebook",
    profileFields: ['id', 'displayName', 'name', 'gender', 'photos', 'emails']

},
(accessToken, refreshToken, profile, next) => {
    console.log(profile.emails)
    User.findOne({ "social.facebookID": profile.id })
        .then((user) => {
            if (user) {
                next(null, user);
            } else {
                const newUser = new User({
                    name: profile.displayName,
                    email: 'qwert@fjhjkh.com',
                    avatar: profile.photos[0].value,
                    password: profile.provider + randomPassword(),
                    social: {
                        facebook: profile.id,
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



const instagram = new InstagramStrategy({

    clientID: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    callbackURL: "/auth/instagram",
    profileFields: ['id', 'displayName', 'name', 'gender', 'photos', 'emails']

},
(accessToken, refreshToken, profile, next) => {
    console.log(profile.emails)
    User.findOne({ "social.instagramID": profile.id })
        .then((user) => {
            if (user) {
                next(null, user);
            } else {
                const newUser = new User({
                    name: profile.displayName,
                    email: 'qwert@fjhjkh.com',
                    avatar: profile.photos[0].value,
                    password: profile.provider + randomPassword(),
                    social: {
                        facebook: profile.id,
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






passport.serializeUser(function(user, next) {
    next(null, user);
});
passport.deserializeUser(function(user, next) {
    next(null, user);
});

// passport.use(google)
passport.use(slack)
passport.use(facebook)
passport.use(instagram)
passport.use(google)
module.exports = passport.initialize()
