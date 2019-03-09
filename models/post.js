const mongoose = require("mongoose");
const Schema = mongoose.Schema;


var PostSchema = new Schema({
    post_text: String,
    post_date: Date,
    post_author: {
        author_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        author_username: String
    },
    post_replies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reply"
        }
    ]
})

var Post = mongoose.model("Post", PostSchema);


module.exports = Post
