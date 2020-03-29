const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {  // maybe implement this as a middleware
    const header = req.headers.authorization;

    if (!header) res.json({ message: 'no token', access: false });
    
    const token = header.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedFromToken) => {
        if (err) res.json({ message: 'failed to verify token', access: false});
        
        req.user = decodedFromToken;
        res.json({ access: true, userData: {
            email: decodedFromToken.email,
            username: decodedFromToken.username,
            tag: decodedFromToken.tag,
            rank: decodedFromToken.rank
        } });
        next();
    })
}

router.get('/check-token', checkToken);

module.exports = router;