const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users.controller')
const stablishmentController = require('../controllers/stablisnment.controller')
const commentsController = require('../controllers/comments.controller')


const sessionMiddleware = require('../middlewares/session.middleware')
const userMiddleware = require('../middlewares/user.middleware')

const upload = require('../config/multer.config');
const { stablishmentList } = require('../controllers/stablisnment.controller');


router.get('/', usersController.init)
router.get('/login', sessionMiddleware.isNotAuthenticated, usersController.login)
router.post('/login', sessionMiddleware.isNotAuthenticated, usersController.doLogin)
router.get('/signupType', sessionMiddleware.isNotAuthenticated, usersController.signupType)
router.post('/signupType', sessionMiddleware.isNotAuthenticated, usersController.signupType)
router.get('/signup', sessionMiddleware.isNotAuthenticated, usersController.signup)
router.post('/signup', sessionMiddleware.isNotAuthenticated, upload.single('avatar'), usersController.createUser)

router.post('/logout', sessionMiddleware.isAuthenticated, usersController.logout)

router.get('/findby', sessionMiddleware.isAuthenticated, stablishmentController.findby)
router.post('/findby', sessionMiddleware.isAuthenticated, stablishmentController.findby)
router.post('/modality', sessionMiddleware.isAuthenticated, stablishmentController.stablishmentsList)
router.post('/location', sessionMiddleware.isAuthenticated, stablishmentController.stablishmentsListLocation)
router.post('/locationbymap', sessionMiddleware.isAuthenticated, stablishmentController.stablishmentsListLocationMap)


router.get('/users/:id/activate/:token', sessionMiddleware.isNotAuthenticated, usersController.activateUser);

// CRUD
router.get('/users/:id/edit', sessionMiddleware.isAuthenticated, usersController.edit);
router.post('/users/:id/edit', sessionMiddleware.isAuthenticated, upload.single('avatar'), usersController.update);
router.post('/users/:id/delete', sessionMiddleware.isAuthenticated, usersController.delete);
router.get('/users/:id', sessionMiddleware.isAuthenticated, usersController.show);


router.post('/stablishments/:id/like', sessionMiddleware.isAuthenticated, stablishmentController.like)

// router.get('/auth/instagram', usersController.doSocialLoginInstagram);
router.get('/auth/facebook', sessionMiddleware.isNotAuthenticated, usersController.doSocialLoginFacebook);
router.get('/auth/google', sessionMiddleware.isNotAuthenticated, usersController.doSocialLoginGoogle);
// router.get('/auth/slack', sessionMiddleware.isNotAuthenticated, usersController.doSocialLoginSlack);

router.get('/stablishments/list', sessionMiddleware.isAuthenticated, stablishmentController.stablishmentsList);
router.get('/stablishments/:id', sessionMiddleware.isAuthenticated, usersController.show);

router.post('/comments', sessionMiddleware.isAuthenticated, commentsController.create)


// router.get('/stablishments/mapview', stablishmentController.stablishmentsMapView);
// router.get('/stablishment/:id', sessionMiddleware.isAuthenticated);
// router.post('/stablishment/:id', sessionMiddleware.isAuthenticatedAsStablishment);







const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users.controller')
const stablishmentController = require('../controllers/stablisnment.controller')
const commentsController = require('../controllers/comments.controller')


const sessionMiddleware = require('../middlewares/session.middleware')
const userMiddleware = require('../middlewares/user.middleware')

const upload = require('../config/multer.config');
const { stablishmentList } = require('../controllers/stablisnment.controller');


router.get('/', usersController.init)
router.get('/login', sessionMiddleware.isNotAuthenticated, usersController.login)
router.post('/login', sessionMiddleware.isNotAuthenticated, usersController.doLogin)
router.get('/signupType', sessionMiddleware.isNotAuthenticated, usersController.signupType)
router.post('/signupType', sessionMiddleware.isNotAuthenticated, usersController.signupType)
router.get('/signup', sessionMiddleware.isNotAuthenticated, usersController.signup)
router.post('/signup', sessionMiddleware.isNotAuthenticated, upload.single('avatar'), usersController.createUser)

router.post('/logout', sessionMiddleware.isAuthenticated, usersController.logout)

router.get('/findby', sessionMiddleware.isAuthenticated, stablishmentController.findby)
router.post('/findby', sessionMiddleware.isAuthenticated, stablishmentController.findby)
router.post('/modality', sessionMiddleware.isAuthenticated, stablishmentController.stablishmentsList)
router.post('/location', sessionMiddleware.isAuthenticated, stablishmentController.stablishmentsListLocation)
router.post('/locationbymap', sessionMiddleware.isAuthenticated, stablishmentController.stablishmentsListLocationMap)


router.get('/users/:id/activate/:token', sessionMiddleware.isNotAuthenticated, usersController.activateUser);

// CRUD
router.get('/users/:id/edit', sessionMiddleware.isAuthenticated, usersController.edit);
router.post('/users/:id/edit', sessionMiddleware.isAuthenticated, upload.single('avatar'), usersController.update);
router.post('/users/:id/delete', sessionMiddleware.isAuthenticated, usersController.delete);
router.get('/users/:id', sessionMiddleware.isAuthenticated, usersController.show);


router.post('/stablishments/:id/like', sessionMiddleware.isAuthenticated, stablishmentController.like)

// router.get('/auth/instagram', usersController.doSocialLoginInstagram);
router.get('/auth/facebook', sessionMiddleware.isNotAuthenticated, usersController.doSocialLoginFacebook);
router.get('/auth/google', sessionMiddleware.isNotAuthenticated, usersController.doSocialLoginGoogle);
// router.get('/auth/slack', sessionMiddleware.isNotAuthenticated, usersController.doSocialLoginSlack);

router.get('/stablishments/list', sessionMiddleware.isAuthenticated, stablishmentController.stablishmentsList);
router.get('/stablishments/:id', sessionMiddleware.isAuthenticated, usersController.show);

router.post('/comments', sessionMiddleware.isAuthenticated, commentsController.create)
router.post('/comments/:id/delete', sessionMiddleware.isAuthenticated, commentsController.delete)


// router.get('/stablishments/mapview', stablishmentController.stablishmentsMapView);
// router.get('/stablishment/:id', sessionMiddleware.isAuthenticated);
// router.post('/stablishment/:id', sessionMiddleware.isAuthenticatedAsStablishment);







module.exports = router;