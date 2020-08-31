const express = require('express');
const router = express.Router();
const multer = require('multer');
const usersController = require('../controllers/users.controller')

const sessionMiddleware = require('../middlewares/session.middleware')

const uploads = require('../config/multer.config');


router.get('/', (req, res) => { res.redirect('init') })
router.get('/auth/instagram', (req, res) => { res.redirect('init') });

router.get('/stablishment/:id', sessionMiddleware.isAuthenticated, projectsController.detail);
router.post('/stablishment/:id', sessionMiddleware.isAuthenticatedAsStablishment, projectsController.detail);






module.exports = router;