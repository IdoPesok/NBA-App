const express = require("express")
const router = express.Router({ mergeParams: true })
const middleware = require("../middleware")
const Post = require("../models/post")


router.get("/", (req, res) => {
    Post.find({}).populate('post_replies').exec((err, foundPosts) => {
        if (err) {
            req.flash("error", "There has been an unknown error and no posts were fetched.")
            return res.render("discussion/posts/index", { posts: [] })
        }

        foundPosts.reverse()
        foundPosts.forEach((post) => {
            post.post_replies.reverse()
        })

        return res.render("discussion/posts/index", { posts: foundPosts })
    })
})

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("discussion/posts/new")
})

router.get("/:reply_id/edit", middleware.isPostOwner, (req, res) => {
    var post_id = req.params.post_id
    var reply_id = req.params.reply_id

    Post.findById(post_id, (err, foundPost) => {
        if (err) {
            req.flash("error", "Post you are trying to edit cannot be found. Please try again later.")
            return res.redirect("/discussion")
        }

        Reply.findById(reply_id, (err, foundReply) => {
            if (err) {
                req.flash("error", "Post you are trying to edit cannot be found. Please try again later.")
                return res.redirect("/discussion")
            }

            return res.render("discussion/replies/edit", { post: foundPost, reply: foundReply })
        })
    })
})

router.post("/", middleware.isLoggedIn, (req, res) => {
    var post = getPostFromRequest(req)

    Post.create(post, (err, createdPost) => {
        if (err) {
            req.flash("error", "Due to an unknown error your post was not created. Please try again.")
            return res.redirect("/discussion")
        }

        req.flash("success", "Your post was created and up for all to see!")
        return res.redirect("/discussion")
    })
})

router.put("/:post_id", middleware.isPostOwner, (req, res) => {
    var post = getPostFromRequest(req)
    var post_id = req.params.post_id

    Post.findOneAndUpdate({ _id: post_id }, post, (err, updatedPost) => {
        if (err) {
            req.flash("error", "Could not update your post due to an unkown error. Please try again later.")
            return res.redirect("/discussion")
        }

        req.flash("success", "Success! Your post was updated!")
        res.redirect("/discussion")
    })
})

router.delete("/:post_id", middleware.isPostOwner, (req, res) => {
    var post_id = req.params.post_id

    Post.findOneAndRemove({ _id: post_id }, (err, removedPost) => {
        if (err) {
            req.flash("error", "Could not delete your post due to an unkown error. Please try again later.")
            return res.redirect("/discussion")
        }

        req.flash("success", "Success! Your post was deleted!")
        res.redirect("/discussion")
    })
})

function getPostFromRequest(req) {
    var post = {
        post_text: req.body.text,
        post_date: Date.now(),
        post_author: {
            author_id: req.user._id,
            author_username: req.user.username
        }
    }

    return post
}


module.exports = router
