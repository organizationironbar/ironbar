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

}, { timestamps: true });

const Score = mongoose.model("Score", scoreSchema);

scoreSchema.statics.calcAverageRatings = async function(stablishmentId) {
    // this points to current model
    const stats = await this.aggregate([{
            $match: { stablishment: stablishmentId }
        },
        {
            $group: {
                _id: '$stablishment',
                nRatings: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    if (stats.length > 0) {
        await User.findByIdAndUpdate(stablishmentId, {
            ratingsQuantity: stats[0].nRatings,
            ratingsAverage: stats[0].avgRating
        });
    } else {
        await User.findByIdAndUpdate(stablishmentId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        });
    }
};

scoreSchema.post('save', function() {
    // this points to current review

    this.constructor.calcAverageRatings(this.stablishment);
});

scoreSchema.pre(/^findOneAnd/, async function(next) {
    this.r = await this.findOne();
    next();
});

scoreSchema.post(/^findOneAnd/, async function(next) {
    await this.r.constructor.calcAverageRatings(this.r.stablishment);
});


module.exports = Score;