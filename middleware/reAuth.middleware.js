const jwt = require('jsonwebtoken')

require('dotenv').config();

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        const refreshToken = req.headers.authorization.split(' ')[1]

        req.user = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)
        next()
    } catch (e) {
        return res.status(401).json({message: 'Auth error'})
    }
}