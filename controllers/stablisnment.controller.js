const User = require("../models/user.model")
const Score = require("../models/score.model")

// const catchAsync = require('./../utilities/catchAysnc');


// module.exports.getStablishmentStats = catchAsync(async(req, res, next) => {
//     const stats = await User.aggregate([{
//             $match: { ratingsAverage: { $gte: 4.5 } }
//         },
//         {
//             $group: {
//                 numRatings: { $sum: '$ratingsQuantity' },
//                 avgRating: { $avg: '$ratingsAverage' },
//             }
//         },
//         {
//             $sort: { avgPrice: 1 }
//         }
//     ]);

//     res.status(200).json({
//         status: 'success',
//         data: { stats }
//     });
// });

module.exports.stablishmentsList = (req, res, next) => {
    // const criteria = {}

    // if (req.query.search) {
    //   res.locals.search = req.query.search
    //   criteria['$or'] = [
    //     { name: new RegExp(req.query.search, "i") },
    //     { ['author.name']: new RegExp(req.query.search, "i") },
    //     { ['staff.name']: new RegExp(req.query.search, "i") }
    //   ]
    // }

    User.find({ type: 'stablishment' })
        .populate('comments')
        .populate('score')
        .then(stablishments => {
            // console.log(stablishments)
            stablishments.forEach(stablishment => {
                Score.find({ stablishment: stablishment }, function(err, score) {
                        Score.aggregate(
                            [{
                                $group: {
                                    _id: "$stablishment",
                                    ratingsAverage: { $avg: "$score" }
                                }
                            }],
                            function(err, result) {
                                // console.log(result)
                                User.findOneAndUpdate({ user: stablishment }, { $set: { ratingsAverage: result.ratingsAverage } })
                                    // console.log(`stabbbbbbbbbbb ${JSON.stringify(stablishment)}`)
                                    // console.log(' ')
                            });
                    })
                    // .then(score => console.log(Score.find({}).pretty()))
            });

            res.render('stablishments/list', { stablishments })
        })
        .catch(next)
}