const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const verify = require('../utilities/verify-token');

function jwtValidation(req, res, next) {
    try {
        const jwtUser = jwt.verify(verify(req), keys.secretOrKey);
        req.userId = jwtUser.id
        next();
    } catch (err) {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = jwtValidation