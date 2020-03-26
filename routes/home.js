const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.redirect('/home');
  });
  
router.get('/home', (req, res, next) => {
    res.send(`
      <h1>Welcome!</h1>
      <a href='/user/login'>Login</a>
    `);
    next();
});

module.exports = router;