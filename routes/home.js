const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.redirect('/home');
  });
  
router.get('/home', (req, res, next) => {
    res.send({home: 'react is connected to express!'});
    console.log('sent1')
    next();
});

module.exports = router;