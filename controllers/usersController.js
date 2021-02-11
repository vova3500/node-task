const User = require('../models/User')

require('dotenv').config();

class usersController {
    async getUsers(req, res) {
        try {
            const {username} = req.query

            if (username) {
                const users = await User.find({username})
                if (users.length) {
                    return res.json(...users)
                }

                return res.status(404).json({message: "No user"})
            }

            const users = await User.find({})
            if (users.length) {
                return res.json(users)
            }

            return res.status(404).json({message: "No users"})
        } catch (e) {
            return res.status(400).json(e)
        }
    }
}

module.exports = new usersController