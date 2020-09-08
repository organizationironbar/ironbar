const User = require("../models/user.model");
const Score = require("../models/score.model");

function formatLocation(loc) {
    console.log("LOCATION FORMATLOCATION: " + JSON.stringify(loc));
    var parsedAddress = loc.addressnew.split(",");
    var streetNum, streetName, zipCode, city, zc;
    parsedAddress.length > 3 ? (zc = parsedAddress[2].split(" ")) : "";
    if (parsedAddress.length === 4) {
        streetNum = parsedAddress[1];
        streetName = parsedAddress[0];
        zipCode = zc[0];
        city = zc[1];
    } else if (parsedAddress.length === 3) {
        streetNum = 0;
        streetName = parsedAddress[0];
        zipCode = zc[0];
        city = zc[1];
    } else if (parsedAddress.length === 2) {
        streetNum = 0;
        streetName = "";
        zipCode = "0000";
        city = parsedAddress[0];
    } else {
        streetNum = 0;
        streetName = parsedAddress[0];
        zipCode = "0000";
        city = parsedAddress[1];
    }
    return city;
}

module.exports.stablishmentsList = (req, res, next) => {
    let parsedCategories;

    if (typeof req.body.modality == 'string') {
        var convertToObjc = JSON.parse(`[{ "category": "${req.body.modality}" }]`);
    } else if (typeof req.body.modality != 'string' && req.body.modality != undefined) {
        parsedCategories = "";
        for (let a = 0; a < req.body.modality.length; a++) {
            parsedCategories = `${parsedCategories}{ "category": "${req.body.modality[a]}" }, `;
        }
        parsedCategories = parsedCategories.slice(0, -2);
        convertToObjc = JSON.parse("[" + parsedCategories + "]");

    } else {
        convertToObjc = {};
    }

    User.find({ type: "stablishment" })
        .or(convertToObjc)

    .populate("comments")
        .populate("score")
        .then((stablishments) => {
            stablishments.forEach((stablishment) => {
                Score.find({ stablishment: stablishment }, function(err, score) {
                    Score.aggregate(
                        [{
                            $group: {
                                _id: "$stablishment",
                                ratingsAverage: { $avg: "$score" },
                            },
                        }, ],
                        function(err, result) {
                            User.findOneAndUpdate({ user: stablishment }, { $set: { ratingsAverage: result.ratingsAverage } });
                        }
                    );
                });
                // .then(score => console.log(Score.find({}).pretty()))
            });

            res.render("stablishments/list", { stablishments });
        })
        .catch(next);
};

module.exports.stablishmentsListLocation = (req, res, next) => {
    let location;

    req.body ? (location = req.body) : {};
    let city = formatLocation(location);
    console.log("LOCATION: " + JSON.stringify(city));
    User.find({ type: "stablishment", city: city })

    .populate("comments")
        .populate("score")
        .then((stablishments) => {
            stablishments.forEach((stablishment) => {
                Score.find({ stablishment: stablishment }, function(err, score) {
                    Score.aggregate(
                        [{
                            $group: {
                                _id: "$stablishment",
                                ratingsAverage: { $avg: "$score" },
                            },
                        }, ],
                        function(err, result) {
                            User.findOneAndUpdate({ user: stablishment }, { $set: { ratingsAverage: result.ratingsAverage } });
                        }
                    );
                });
            });

            res.render("stablishments/list", { stablishments });
        })
        .catch(next);
};

module.exports.stablishmentsListLocationMap = (req, res, next) => {
    let location;

    req.body ? (location = req.body) : {};
    let city = formatLocation(location);
    console.log("LOCATION: " + JSON.stringify(city));
    User.find({ type: "stablishment", city: city })

    .populate("comments")
        .populate("score")
        .then((stablishments) => {
            stablishments.forEach((stablishment) => {

            });

            res.render("stablishments/list", { stablishments });
        })
        .catch(next);
};

module.exports.findby = (req, res, next) => {
    if (req.body.findby === "modality") {
        res.render("stablishments/modality");
    } else if (req.body.findby === "location") {
        res.render("stablishments/location");
    } else {
        res.render("stablishments/findby");
    }
};


module.exports.score = (req, res, next) => {
    const scoreValue = req.params.scoreValue
    const params = { stablishment: req.params.id, user: req.currentUser._id };


    Score.findOne(params)
        .then(newscore => {

            if (newscore) {
                Score.findByIdAndRemove(newscore._id)
                    .then(() => {
                        res.json({ score: -1 });
                    })
                    .catch(next);
            } else {
                const newScore = new Score({ stablishment: req.params.id, user: req.currentUser._id, score: scoreValue });

                newScore.save()
                    // .then(() => {
                    //   res.json({ score: 1 });

                // })
                .then(() => {
                        Score.find({ stablishment: req.params.id })
                            .then(allScores => {
                                let sumatoria = allScores.reduce((function(acumulador, siguienteValor) {
                                        return acumulador + siguienteValor.score;

                                    }), 0

                                )
                                let result = sumatoria / allScores.length
                            })
                    })
                    .catch(next);
            }
        })
        .catch(next);
}