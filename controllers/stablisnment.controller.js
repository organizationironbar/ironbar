const User = require("../models/user.model");
const Like = require("../models/like.model");

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
    console.log("HOLA : " + JSON.stringify(req.body.modality))
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

    
        .populate("likes")
        .populate({
            path: 'comments',
            options: {
              sort: {
                createdAt: -1
              }
            },
            populate: {
                path: 'user'
            }
          })
        .then((stablishments) => {

console.log(stablishments)
            res.render("stablishments/list", { stablishments, convertToObjc });
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
        .populate("likes")
        .then((stablishments) => {


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
        //revisar si necesitamos populate
        .populate("comments")
        .populate("likes")
        .then((stablishments) => {
            res.render("stablishments/listmap", {
                stablishments,
                pointsJSON: encodeURIComponent(JSON.stringify(stablishments))
            });
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


module.exports.like = (req, res, next) => {

    const params = { stablishment: req.params.id, user: req.currentUser._id };

    Like.findOne(params)
        .then(like => {
            if (like) {
                Like.findByIdAndRemove(like._id)
                    .then(() => {
                        res.json({ like: -1 });
                    })
                    .catch(next);
            } else {
                const newLike = new Like(params);

                newLike.save()
                    .then(() => {
                        res.json({ like: 1 });
                    })
                    .catch(next);
            }
        })
        .catch(next);
}