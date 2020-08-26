const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    text: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ["User","Stablishment"],
        required: true,
    },
    stablishment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stablishment",
        required: true,
    },
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;