require("../config/db.config");
const streetsMad = require('./addressesMad.js')

const User = require("../models/user.model");
const Comment = require("../models/comments.model");
const Like = require("../models/like.model")

const modalities = ['Cafetería', 'Restauración', 'Cervecería', 'Ocio Nocturno', 'Espectáculos']


const allStabls = []
const allPeople = []
const faker = require("faker");

Promise.all([
        User.deleteMany(),
        Comment.deleteMany(),
        Like.deleteMany(),
    ])
    .then(() => {
        console.log('empty database')

        for (let i = 0; i < 100; i++) {
            const street = streetsMad[i]
            const randomUser = [{
                    type: 'stablishment',
                    name: faker.name.findName(),
                    email: faker.internet.email(),
                    username: faker.internet.userName(),
                    password: '12345678',
                    createdAt: faker.date.past(),
                    contactEmail: faker.lorem.word() + '@gmail.com',
                    telephone: faker.phone.phoneNumber(),
                    location: {
                        lat: street["latitude"],
                        lng: street["longitude"],
                    },

                    address: street["streetName"],
                    number: Math.floor(Math.random() * 100),
                    city: faker.address.city(),
                    zipCode: faker.address.zipCode(),

                    avatar: imageUrls[i],
                    bio: faker.lorem.sentence(),
                    category: modalities[Math.floor(Math.random() * (modalities.length - 1))],
                },
                {
                    type: 'user',
                    name: faker.name.findName(),
                    email: faker.internet.email(),
                    username: faker.internet.userName(),
                    password: '12345678',
                    avatar: faker.image.avatar(),
                    bio: faker.lorem.sentence(),
                    createdAt: faker.date.past(),
                }

            ]
            const user = new User(randomUser[Math.floor(Math.random() * 2)]);

            user.save()
                .then((user) => {
                    user.type === 'stablishment' ? allStabls.push(user) : allPeople.push(user)
                    if (allStabls.length > 0 && allPeople.length > 0) {
                        for (let k = 0; k < Math.floor(Math.random() * 7); k++) {
                            const comment = new Comment({
                                user: allPeople[Math.floor(Math.random() * allPeople.length)]._id,
                                stablishment: allStabls[Math.floor(Math.random() * allStabls.length)]._id,
                                text: faker.lorem.sentence(),
                            })
                            comment.save()

                        }
                        for (let j = 0; j < 100; j++) {
                            const like = new Like({
                                user: allPeople[Math.floor(Math.random() * allPeople.length)]._id,
                                stablishment: allStabls[Math.floor(Math.random() * allStabls.length)]._id,

                            })
                            like.save()
                        }
                    }
                })
        }
    })