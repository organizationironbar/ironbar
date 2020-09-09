const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    stablishment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stablishment",
        required: true,
    }
    

}, { timestamps: true });

const Like = mongoose.model("Like", likeSchema);



// likeSchema.post('save', function() {
//     // this points to current review

//     this.constructor.calcAverageRatings(this.stablishment);
// });

// likeSchema.pre(/^findOneAnd/, async function(next) {
//     this.r = await this.findOne();
//     next();
// });

// likeSchema.post(/^findOneAnd/, async function(next) {
//     await this.r.constructor.calcAverageRatings(this.r.stablishment);
// });


module.exports = Like;