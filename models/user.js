const mongoose = require("mongoose");
const Schema = mongoose.Schema;


var UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    }
})

var User = mongoose.model("User", UserSchema);


module.exports = User
