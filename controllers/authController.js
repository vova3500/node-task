const User = require('../models/User')
const {validationResult} = require("express-validator")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();


class AuthController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({massage: "Incorrect request", errors})
            }

            const {username, password} = req.body

            const candidate = await User.findOne({username})

            if (candidate) {
                return res.status(400).json({massage: `User with username ${username} already exist`})
            }

            const hashPassword = await bcrypt.hash(password, 8)

            const user = new User({username, password: hashPassword})

            await user.save()

            const token = jwt.sign({id: user._id}, process.env.SECRET_KEY, {expiresIn: "1h"})
            const refreshToken = jwt.sign({id: user._id}, process.env.SECRET_KEY_REFRESH_TOKEN, {expiresIn: "60 days"})

            res.cookie("refreshToken", refreshToken)

            return res.json(
                {
                    UserId: user._id,
                    token,
                    refreshToken
                })

        } catch (e) {
            return res.status(400).json(e)
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body

            const user = await User.findOne({username})

            if (!user) {
                return res.status(404).json({massage: "User not found"})
            }

            const isPassValid = bcrypt.compareSync(password, user.password)
            if (!isPassValid) {
                return res.status(400).json({massage: "Invalid password"})
            }

            const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {expiresIn: "1h"})
            const refreshToken = jwt.sign({id: user._id}, process.env.SECRET_KEY_REFRESH_TOKEN, {expiresIn: "60 days"})

            res.cookie("refreshToken", refreshToken)

            return res.json(
                {
                    UserId: user._id,
                    token,
                    refreshToken
                }
            )

        } catch (e) {
            return res.status(400).json(e)
        }
    }
}

module.exports = new AuthController