const mongoose = require("mongoose");
const Schema = mongoose.Schema;


var ReplySchema = new Schema({
    reply_author: {
        author_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        author_username: String
    },
    reply_text: String,
    reply_date: Date
})

var Reply = mongoose.model("Reply", ReplySchema);


module.exports = Reply
