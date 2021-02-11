const express = require('express');
const router = express.Router();
const {check} = require("express-validator")

const reAuthMiddleware = require('../middleware/reAuth.middleware')

const authController = require('../controllers/authController')

router.post("/registration", [
    check("username", "Username must be longer than 3 and shorter than 20")
        .isLength({min: 3, max: 20}),
    check("password", "Password must be longer than 5 and shorter than 12")
        .isLength({min: 6, max: 12})

], authController.registration)
router.post("/login", authController.login)
router.post("", reAuthMiddleware, authController.reAuth)


module.exports = router;