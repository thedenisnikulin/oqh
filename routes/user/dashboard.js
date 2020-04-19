const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res, next) => checkToken(req, res, next), (req, res, next) => {
    
});

module.exports = router;