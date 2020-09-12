require("../config/db.config");

const User = require("../models/user.model");
const Comment = require("../models/comments.model");
const Like = require("../models/like.model")

const modalities = ['Cafetería', 'Restauración', 'Cervecería', 'Ocio Nocturno', 'Espectáculos']

const streetsMadrid = ['Madrid', 'Calle de Juana Doña', 'Paseo de Juan Antonio Vallejo-Nájera Botas', 'Plaza Mayor de Barajas', 'Paseo de Marcelino Camacho', 'Calle de la Cooperación', 'Calle de Diego Torres Villarroel', 'Plaza de la Charca Verde', 'Calle Memorial 11 de marzo de 2004', 'Plaza de José Castillejo', 'Calle de la Poeta Ángela Figuera', 'Calle Max Aub', 'Calle Melquíades Álvarez', 'Calle del Maestro Ángel Llorca', 'Plaza del Rastrillo', 'Calle y Travesía Poeta Blas de Otero', 'Calle Guillermo Rovirosa', 'Calle Carlota ONeill', 'Plaza de El Pardo', 'Calle Carlos Morla Lynch', 'Plaza del Baile', 'Calle Manuel Chaves Nogales', 'Avenida Ingeniero Emilio Herrera', 'Calle José Rizal', 'Avenida de Las Águilas', 'Calle Maestra Justa Freire', 'Calle Soledad Cazorla', 'Calle de Rober? Capa', 'Calle Anselmo Lorenzo', 'Calle Blas Cabrera', 'Avenida de la Memoria', 'Paseo de la Maestra María Sánchez Arbós', 'Glorieta de Ramón Gaya', 'Calle de Gerda Taro', 'Calle Arquitecto Sánchez Arcas', 'Plaza José Moreno Villa', 'Calle de Melchor Rodríguez', 'Calle Filósofa Simone Weil', 'Calle Pintora Ángeles Santos', 'Calle del Barco Sinaia', 'Plaza Corpus Barga', 'Calle Mercedes Fórmica', 'Pasaje de Enrique Ruano', 'Calle de la Institución Libre de Enseñanza', 'Calle Aviador Zorita', 'Calle de Fortunata y Jacinta', 'Calle Julián Besteiro', 'Calle San Germán', 'Calle Edgar Neville', 'Calle y Escalinata Matilde Landa', 'Calle Julián Zugazagoitia', 'Calle del Poeta Joan Maragall', 'Plaza Elíptica']


const allStabls = []
const allPeople = []
const faker = require("faker");

//TODO: CAMBIAR IMAGEN AVATAR RESTAURANTES
Promise.all([
        User.deleteMany(),
        Comment.deleteMany(),
        Like.deleteMany(),
    ])
    .then(() => {
        console.log('empty database')

        for (let i = 0; i < 100; i++) {
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
                        lat: faker.address.latitude(),
                        lng: faker.address.longitude(),
                    },

                    address: faker.address.streetName(),
                    number: Math.floor(Math.random() * 100),
                    city: faker.address.city(),
                    zipCode: faker.address.zipCode(),

                    avatar: 'https://source.unsplash.com/1600x900/?restaurant',
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