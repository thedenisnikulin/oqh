const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');

const withAuth = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header) return res.status(401).json({ message: 'no token' });
    
    const token = header.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedFromToken) => {
        if (err) return res.status(500).json({ message: 'failed to verify token'});

        req.user = decodedFromToken;
        next();
    })
}

router.get('/dashboard', withAuth, (req, res) => {
    var safeUserData = req.user;
    safeUserData.password = null;
    res.status(200).json(safeUserData);
});

module.exports = router;