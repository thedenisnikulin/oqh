const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.redirect('/home');
  });
  
router.get('/home', (req, res, next) => {
    res.send(`
      <h1>Welcome!</h1>
      <p>Login as:</p>
      <a href='/company/login'>Company</a>
      <a href='/user/login'>User</a>
    `);
    next();
});

module.exports = router;