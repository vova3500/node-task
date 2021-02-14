const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware')

const usersController = require('../controllers/usersController')

router.get("/", authMiddleware, usersController.getUsers)

module.exports = router;