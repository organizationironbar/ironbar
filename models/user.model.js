const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Score = require('../models/score.model')
const Comment = require('../models/comments.model')


const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const generateRandomToken = () => {
    const characters =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let token = "";
    for (let i = 0; i < 25; i++) {
        token += characters[Math.floor(Math.random() * characters.length)];
    }
    return token;
};

function isAddressMandatory() {
    if (this.type === 'stablishment') {
        return true;
    }
    return false;
}
const userSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        default: "user",
        enum: ["user", "stablishment"],
    },

    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [3, "Name needs at last 3 chars"],
        trim: true,
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        match: [EMAIL_PATTERN, "Email is invalid"],
    },
    contactEmail: {
        type: String,
        trim: true,
        lowercase: true,
        match: [EMAIL_PATTERN, "Email is invalid"],
    },
    telephone: {
        type: String,
        trim: true,
    },
    avatar: {
        type: String,
    },
    password: {
        type: String,
        minlength: [8, "password min length is 8"],
    },
    bio: {
        type: String,
    },
    activation: {
        active: {
            type: Boolean,
            default: false,
        },
        token: {
            type: String,
            default: generateRandomToken,
        },
    },
    social: {
        slackID: String,
        googleID: String,
        facebookID: String,
    },
    category: {
        type: String,
        enum: [
            "Cafetería",
            "Restauración",
            "Cervecería",
            "Ocio Nocturno",
            "Espectáculos",
        ],
    },
    ratingsAverage: {
        type: Number,
        required: isAddressMandatory,
        default: 2.5
    },
    location: {
        lat: {
            type: Number,
            required: isAddressMandatory,
        },
        lng: {
            type: String,
            required: isAddressMandatory,
        },
    },
    city: {
        required: isAddressMandatory,
        type: String,
    },
    address: {
        required: isAddressMandatory,
        type: String,
    },
    number: {
        type: String
    },
    zipCode: {
        required: isAddressMandatory,
        type: String,
    },

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


userSchema.pre("save", function(next) {
    if (this.isModified("password")) {
        bcrypt.hash(this.password, 10).then((hash) => {
            this.password = hash;
            next();
        });
    } else {
        next();
    }
});

userSchema.post("remove", function(next) {
    Promise.all([
        User.deleteMany({ author: this._id }),
        Score.deleteMany({ user: this._id }),
        Comment.deleteMany({ user: this._id }),
    ]).then(next);
});

userSchema.methods.checkPassword = function(password) {
    return bcrypt.compare(password, this.password);
};


userSchema.virtual("comments", {
    ref: "Comment",
    localField: "_id",
    foreignField: "stablishment",
    justOne: false,
});

userSchema.virtual("score", {
    ref: "Score",
    localField: "_id",
    foreignField: "stablishment",
    count: true,
});



const User = mongoose.model("User", userSchema);

module.exports = User;