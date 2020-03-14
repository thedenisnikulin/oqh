const express = require('express')
const router = express.Router();

const isLoggedIn = (req, res, next) => {
    const user = req.session.user;
    const flag = req.session.flag;
    (!user || (flag !== 'company')) ? res.redirect('back') : next();
};

router.get('/dashboard', isLoggedIn, (req, res) => {
    res.send(`
      <h1>Company dashboard</h1>
        <ul>
            <li>email: ${req.session.user.email}</li>
        </ul>
        <a href='/company/logout' />Logout</a>
    `);
});

module.exports = router;