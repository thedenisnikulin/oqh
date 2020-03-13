const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')

const User = require('../../models/index').User;

const isLoggedIn = (req, res, next) => {
    req.session.user ? res.redirect(req.baseUrl + '/dashboard') : next();
};

router.get('/register', isLoggedIn, (req, res, next) => {
    res.send(`
        <h1>Register</h1>
        <form method="post" action="/user/register">
            <input name="username" placeholder="username" required/>
            <input type="email" name="email" placeholder="email" required/>
            <input type="password" name="password" placeholder="password" required />
            <input type="submit" />
        </form>
        <a href="/user/login">Login</a>
    `);
})

router.get('/login', isLoggedIn, (req, res, next) => {
    res.send(`
        <h1>Login</h1>
        <form method="post" action="/user/login">
            <input type="email" name="email" placeholder="email" required/>
            <input type="password" name="password" placeholder="password" required />
            <input type="submit" />
        </form>
        <a href="/user/register">Register</a>
    `);
})

router.post('/register', async (req, res) => {
    console.log(req.body)
    const { username, password, email } = req.body;
    const user = User.findOne({
        where: {
            email
        }
    })
        .then(async (result) => {
            if (result) {
                // user already exist
                res.redirect(req.baseUrl + '/register');
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                User.create({
                    username,
                    password: hashedPassword,
                    email
                })
                    .then(user => {
                        // success
                        req.session.user = user.dataValues;    // session
                        res.redirect(req.baseUrl + '/dashboard');
                })
                    .catch(err => console.log(err));
            }
        })
});

router.post('/login', async (req, res, next) => {
    console.log(req.body)
    const { email, password } = req.body;
    const user = User.findOne({
        where: {
            email
        }
    })
        .then((user) => {
            console.log(user.password)
            // no such user
            if (!user) {
                res.redirect(req.baseUrl + '/login');
            } else {
                bcrypt.compare(password, user.password, (err, result) => {
                    // success
                    if (result === true) { 
                        req.session.user = user.dataValues;      // session
                        res.redirect(req.baseUrl + '/dashboard');
                    } else {
                        // invalid password
                        res.redirect(req.baseUrl + '/login');
                    }
                })
            }
        })
        .catch(err => console.log(err));
});

router.get('/logout', (req, res) => {
    if (req.session.user) {
        req.session.destroy(() => res.redirect('/'));
    }
});

module.exports = router;