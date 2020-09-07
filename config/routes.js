const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users.controller')
const stablishmentController = require('../controllers/stablisnment.controller')

const sessionMiddleware = require('../middlewares/session.middleware')
const userMiddleware = require('../middlewares/user.middleware')

const uploads = require('../config/multer.config');
const { stablishmentList } = require('../controllers/stablisnment.controller');


router.get('/', usersController.init)
router.get('/login', sessionMiddleware.isNotAuthenticated, usersController.login)
router.post('/login', sessionMiddleware.isNotAuthenticated, usersController.doLogin)
router.get('/signupType', sessionMiddleware.isNotAuthenticated, usersController.signupType)
router.post('/signupType', sessionMiddleware.isNotAuthenticated, usersController.signupType)
router.get('/signup', sessionMiddleware.isNotAuthenticated, usersController.signup)
router.post('/signup',  upload.single('avatar'), usersController.createUser)

router.get('/findby', sessionMiddleware.isAuthenticated, stablishmentController.findby)
router.post('/findby', sessionMiddleware.isAuthenticated, stablishmentController.findby)
router.post('/modality', sessionMiddleware.isAuthenticated, stablishmentController.stablishmentsList)
router.post('/location', sessionMiddleware.isAuthenticated, stablishmentController.stablishmentsListLocation)


router.get('/users/:id/activate/:token', sessionMiddleware.isNotAuthenticated, usersController.activateUser);

// router.get('/auth/instagram', usersController.doSocialLoginInstagram);
router.get('/auth/facebook', sessionMiddleware.isNotAuthenticated, usersController.doSocialLoginFacebook);
router.get('/auth/google', sessionMiddleware.isNotAuthenticated, usersController.doSocialLoginGoogle);
// router.get('/auth/slack', sessionMiddleware.isNotAuthenticated, usersController.doSocialLoginSlack);


router.get('/stablishments/list', stablishmentController.stablishmentsList);
// router.get('/stablishments/mapview', stablishmentController.stablishmentsMapView);
router.get('/stablishment/:id', sessionMiddleware.isAuthenticated);
router.post('/stablishment/:id', sessionMiddleware.isAuthenticatedAsStablishment);






module.exports = router;