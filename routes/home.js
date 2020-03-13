const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.redirect('/home');
  });
  
router.get('/home', (req, res, next) => {
    res.send(`
      <h1>Welcome!</h1>
      ${req.session.user ? `
        <a href='/home'>Home</a>
        <form method='post' action='/user/logout'>
          <button>Logout</button>
        </form>
      ` : `
        <a href='/user/login'>Login</a>
        <a href='/user/register'>Register</a>
      `
      }
    `);
    next();
});

module.exports = router;