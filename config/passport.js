const LocalStrategy = require("passport-local").Strategy
const User = require("../models/user")
const bcrypt = require("bcrypt")


module.exports = function(passport) {
    passport.use(new LocalStrategy((username, password, done) => {
        User.findOne({ username: username }, (err, foundUser) => {
            if (err) {
                return done(err)
            }
            if (!foundUser) {
                return done(null, false, { message: "Could not login. Incorrect username." })
            }
            if (!bcrypt.compareSync(password, foundUser.password)) {
                return done(null, false, { message: "Could not login. Incorrect password." })
            }

            return done(null, foundUser)
        })
    }))

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
}
