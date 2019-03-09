const express = require("express")
const router = express.Router()
const User = require("../models/user")
const passport = require("passport")
const bcrypt = require("bcrypt")
const middleware = require("../middleware")
const Post = require("../models/post")


router.get("/login", (req, res) => {
    res.render("auth/login")
})

router.get("/register", (req, res) => {
    res.render("auth/register")
})

router.post("/login", passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "/login", 
        failureFlash: true,
        successFlash: "Success! You are now logged in!"
    })
)

router.post("/register", (req, res) => {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt)

    checkIfUsernameExists(req.body.username)
        .then(() => {
            User.create({ username: req.body.username, password: hash }, (err, createdUser) => {
                if (err) {
                    return res.send("ERROR")
                }

                req.login(createdUser, (err) => {
                    if (err) {
                        req.flash("error", "Account was created but could not login. Please try again.")
                        return req.redirect("/login") 
                    }

                    req.flash("success", "Success! You are now logged in and registered!")
                    res.redirect("/")
                })
            })
        })
        .catch(() => {
            req.flash("error", "Could not create your account because that username is already in use.")
            return res.redirect("/register")
        })
})

router.get("/logout", middleware.isLoggedIn, (req, res) => {
    req.logout()
    req.flash("success", "Success! You are now logged out!")
    res.redirect("/")
})

router.get("/account", middleware.isLoggedIn, (req, res) => {
    Post.find({ "post_author.author_id": req.user._id }, (err, foundPosts) => {
        if (err) {
            req.flash("error", "Error. Could not retrieve your posts. Please try again later.")
            return res.render("auth/account", { posts: [] })
        }

        res.render("auth/account", { posts: foundPosts })
    })
})

router.post("/reset_username", middleware.isLoggedIn, (req, res) => {
    var user = {
        username: req.body.username,
        password: req.user.password
    }

    checkIfUsernameExists(req.body.username)
        .then(() => {
            User.findOneAndUpdate({ _id: req.user._id }, user, (err, updatedUser) => {
                if (err) {
                    req.flash("error", "Could not update your username due to an unkown error. Please try again later.")
                    return res.redirect("/account")
                }

                req.user.username = req.body.username
                req.flash("success", "Success! Your username was updated!")
                res.redirect("/account")
            })
        })
        .catch(() => {
            req.flash("error", "Could not update your username because that username is already in use.")
            return res.redirect("/account")
        })
})

function checkIfUsernameExists(username) {
    return new Promise((resolve, reject) => {
        User.findOne({ username: username }, (err, foundUser) => {
            if (foundUser) {
                reject()
            }

            resolve()
        })
    })
}


module.exports = router
