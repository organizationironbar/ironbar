const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    stablishment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stablishment",
        required: true,
    },
    score: {
        required: true,
        type: Number,
        enum: [0, 1, 2, 3, 4, 5]
    },
    total: Number,

}, { timestamps: true });

const Score = mongoose.model("Score", scoreSchema);

module.exports = Score;