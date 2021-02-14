const jwt = require('jsonwebtoken')

require('dotenv').config();

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]

        req.user = jwt.verify(token, process.env.SECRET_KEY)
        next()
    } catch (e) {
        return res.status(401).json({message: 'Auth error'})
    }
}