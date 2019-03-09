const express = require("express")
const router = express.Router({ mergeParams: true })
const middleware = require("../middleware")
const Post = require("../models/post")
const Reply = require("../models/reply")


router.get("/new", middleware.isLoggedIn, (req, res) => {
    var post_id = req.params.post_id

    Post.findById(post_id, (err, foundPost) => {
        if (err) {
            req.flash("error", "Unknown error. Please try again later.")
            return res.redirect("/discussion")
        }

        return res.render("discussion/replies/new", { post: foundPost })
    })
})

router.get("/:reply_id/edit", middleware.isReplyOwner, (req, res) => {
    var post_id = req.params.post_id
    var reply_id = req.params.reply_id

    Post.findById(post_id, (err, foundPost) => {
        if (err) {
            req.flash("error", "Reply you are trying to edit cannot be found. Please try again later.")
            return res.redirect("/discussion")
        }


        Reply.findById(reply_id, (err, foundReply) => {
            if (err) {
                req.flash("error", "Reply you are trying to edit cannot be found. Please try again later.")
                return res.redirect("/discussion")
            }

            return res.render("discussion/replies/edit", { post: foundPost, reply: foundReply })
        })
    })
})

router.post("/", middleware.isLoggedIn, (req, res) => {
    var post_id = req.params.post_id
    var reply = getReplyFromRequest(req)

    Post.findById(post_id, (err, foundPost) => {
        if (err) {
            req.flash("error", "Error, could not upload your reply due to an unknown error. Please try again.")
            return res.redirect("/discussion")
        }

        Reply.create(reply, (err, createdReply) => {
            if (err) {
                req.flash("error", "Error, could not upload your reply due to an unknown error. Please try again.")
                return res.redirect("/discussion")
            }

            foundPost.post_replies.push(createdReply._id)
            foundPost.save()

            req.flash("success", "Success! Your reply was posted")
            return res.redirect("/discussion")
        })
    })
})

router.put("/:reply_id", middleware.isReplyOwner, (req, res) => {
    var reply = getReplyFromRequest(req)
    var reply_id = req.params.reply_id

    Reply.findOneAndUpdate({ _id: reply_id }, reply, (err, updatedReply) => {
        if (err) {
            req.flash("error", "Could not update your reply due to an unkown error. Please try again later.")
            return res.redirect("/discussion")
        }

        req.flash("success", "Success! Your reply was updated!")
        res.redirect("/discussion")
    })
})

router.delete("/:reply_id", middleware.isReplyOwner, (req, res) => {
    var reply_id = req.params.reply_id

    Reply.findOneAndRemove({ _id: reply_id }, (err, removedReply) => {
        if (err) {
            req.flash("error", "Could not delete your reply due to an unkown error. Please try again later.")
            return res.redirect("/discussion")
        }

        req.flash("success", "Success! Your reply was deleted!")
        res.redirect("/discussion")
    })
})

function getReplyFromRequest(req) {
    var reply = {
        reply_text: req.body.text,
        reply_date: Date.now(),
        reply_author: {
            author_id: req.user._id,
            author_username: req.user.username
        }
    }

    return reply
}


module.exports = router
