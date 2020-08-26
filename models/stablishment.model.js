const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const generateRandomToken = () => {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < 25; i++) {
        token += characters[Math.floor(Math.random() * characters.length)];
    }
    return token;
}

const stablishmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [3, "Name needs at last 3 chars"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [EMAIL_PATTERN, "Email is invalid"],
    },
    contactEmail: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        match: [EMAIL_PATTERN, "Email is invalid"],
    },
    telephone: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        required: true
    },
    password: {
        type: String,
        minlength: [8, "password min length is 8"]
    },
    bio: {
        type: String
    },
    activation: {
        active: {
            type: Boolean,
            default: false
        },
        token: {
            type: String,
            default: generateRandomToken
        }
    },
    social: {
        slackID: String,
        googleID: String,
        facebookID: String
    },
    category: {
        type: String,
        enum: ['Cafetería', 'Restauración', 'Cervecería', 'Ocio Nocturno', 'Espectáculos'],
        required: true
    },
    location: {

        city: {
            type: String,
            require: true
        },
        address: {
            type: String,
            require: true
        },
        number: {
            type: String
        },
        zipCode: {
            type: String,
            require: true
        }
    }


}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });


stablishmentSchema.pre('save', function(next) {
    if (this.isModified('password')) {
        bcrypt.hash(this.password, 10).then((hash) => {
            this.password = hash;
            next();
        });
    } else {
        next();
    }
})

stablishmentSchema.post('remove', function(next) {
    Promise.all([
            Project.deleteMany({ author: this._id }),
            Like.deleteMany({ user: this._id }),
            Comment.deleteMany({ user: this._id })
        ])
        .then(next)
})

stablishmentSchema.methods.checkPassword = function(password) {
    return bcrypt.compare(password, this.password);
}

const Stablishment = mongoose.model("Stablishment", stablishmentSchema);

module.exports = User;
module.exports = User;