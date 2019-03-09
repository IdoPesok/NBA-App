const express = require("express")
const app = express()
const authRoutes = require("../routes/auth")
const indexRoutes = require("../routes/index")
const discussionRoutes = require("../routes/discussion")
const replyRoutes = require("../routes/replies")
const nbaApiRoutes = require("../routes/nbaapi")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const User = require("../models/user")
const bcrypt = require("bcrypt")
const session = require('express-session')
const flash = require('connect-flash');
const methodOverride = require('method-override')


module.exports = function(app) {
    app.set("view engine", "ejs")
    app.use(express.static("public"))
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(methodOverride('_method'))
    app.use(session({
        secret: '0b246c075eb85e662d5864805274f465',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    }))
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash())


    app.use((req, res, next) => {
        res.locals.error_message = req.flash("error")
        res.locals.success_message = req.flash("success")
        res.locals.currentUser = req.user
        next()
    })


    app.use(authRoutes)
    app.use(nbaApiRoutes)
    app.use("/discussion/:post_id/replies", replyRoutes)
    app.use("/discussion", discussionRoutes)
    app.use(indexRoutes)

    app.listen(3000, () => {
        console.log("server is up and running on port 3000")
    })
}
