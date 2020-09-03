const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users.controller')
const stablishmentController = require('../controllers/stablisnment.controller')

const sessionMiddleware = require('../middlewares/session.middleware')

const uploads = require('../config/multer.config');
const { stablishmentList } = require('../controllers/stablisnment.controller');


router.get('/', usersController.init)
router.get('/login', usersController.login)
router.post('/login', sessionMiddleware.isNotAuthenticated, usersController.doLogin)
router.get('/signupType', usersController.signupType)
router.post('/signupType', usersController.signupType)
router.get('/signup', usersController.signup)
router.post('/signup',  usersController.createUser)

router.get('/findby', stablishmentController.findby)
router.post('/findby', stablishmentController.findby)
router.post('/modality', stablishmentController.stablishmentsList)


router.get('/auth/instagram', usersController.doSocialLoginInstagram);
router.get('/auth/facebook', usersController.doSocialLoginFacebook);

router.get('/auth/google', usersController.doSocialLoginGoogle);

router.get('/auth/slack', sessionMiddleware.isNotAuthenticated, usersController.doSocialLoginSlack);


router.get('/stablishments/list', stablishmentController.stablishmentsList);
// router.get('/stablishments/mapview', stablishmentController.stablishmentsMapView);
router.get('/stablishment/:id', sessionMiddleware.isAuthenticated);
router.post('/stablishment/:id', sessionMiddleware.isAuthenticatedAsStablishment);






module.exports = router;