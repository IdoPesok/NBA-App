var Post = require("../models/post")
var Reply = require("../models/reply")


var middleware = {}


middleware.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        req.flash("error", "You must be logged in to do that!")
        res.redirect("/login")
    }
}

middleware.isPostOwner = function(req, res, next) {
    if (req.isAuthenticated()) {
        var post_id = req.params.post_id

        Post.findById(post_id, (err, foundPost) => {
            if (err) {
                req.flash("error", "Error. Could not find post with that ID. Please try again later")
                return res.redirect("/discussion")
            } else if (!foundPost.post_author.author_id.equals(req.user._id)) {
                req.flash("error", "Error. You do not have permission to do that!")
                return res.redirect("/discussion")
            } else {
                next()
            }
        })
    } else {
        req.flash("error", "You must be logged in to do that!")
        res.redirect("/login")
    }
}

middleware.isReplyOwner = function(req, res, next) {
    if (req.isAuthenticated()) {
        var reply_id = req.params.reply_id

        Reply.findById(reply_id, (err, foundReply) => {
            if (err) {
                req.flash("error", "Error. Could not find reply with that ID. Please try again later")
                return res.redirect("/discussion")
            } else if (!foundReply.reply_author.author_id.equals(req.user._id)) {
                req.flash("error", "Error. You do not have permission to do that!")
                return res.redirect("/discussion")
            } else {
                next()
            }
        })
    } else {
        req.flash("error", "You must be logged in to do that!")
        res.redirect("/login")
    }
}


module.exports = middleware
