const express = require('express');
const router = express.Router();
const multer = require('multer');
const usersController = require('../controllers/users.controller')

const sessionMiddleware = require('../middlewares/session.middleware')

const uploads = require('../config/multer.config');


router.get('/', (req, res) => { res.redirect('init') })
router.get('/auth/slack', (req, res) => { res.redirect('init') });


module.exports = router;