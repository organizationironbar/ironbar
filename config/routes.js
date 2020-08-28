const express = require('express');
const router = express.Router();
const multer = require('multer');
const usersController = require('../controllers/users.controller')

const sessionMiddleware = require('../middlewares/session.middleware')

const uploads = require('../config/multer.config');


router.get('/', sessionMiddleware.isNotAuthenticated )
router.get('/login', sessionMiddleware.isNotAuthenticated )
// router.get('/auth/instagram', usersController.doSocialLoginInstagram());
router.get('/auth/facebook', usersController.doSocialLoginFacebook);

router.get('/auth/slack', sessionMiddleware.isNotAuthenticated, usersController.doSocialLoginSlack);

router.get('/stablishment/:id', sessionMiddleware.isAuthenticated);
router.post('/stablishment/:id', sessionMiddleware.isAuthenticatedAsStablishment);






module.exports = router;