const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const jwtValidation = (req, res, next) => {
    try {
        const jwtUser = decodeToken(req);
        req.userId = jwtUser.id
        next();
    } catch (err) {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

const decodeToken = req => {
    return jwt.verify(getToken(req), keys.secretOrKey)
}

const generateUserToken = user => {
    return new Promise((resolve, reject) => {
        const payload = {
            id: user.id,
            name: user.name,
        };
        // Sign token
        jwt.sign(
            payload,
            keys.secretOrKey,
            {
                expiresIn: 31556926, // 1 year in seconds
            },
            (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token)
                }
            }
        );
    })
}

const getToken = req => {
    if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
    )
        return req.headers.authorization.split(' ')[1];
    return null;
};

module.exports = {
    jwtValidation,
    decodeToken,
    generateUserToken
}
