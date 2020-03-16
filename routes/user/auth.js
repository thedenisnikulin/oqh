const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const User = require('../../models/index').User;


router.get('/register', (req, res, next) => { // must be protected as well as login
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

router.get('/login', (req, res, next) => {
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
    const { email, username, password, tag } = req.body;
    const user = User.findOne({
        where: {
            email
        }
    })
        .then(async (foundUser) => {
            if (foundUser) {
                // user already exists
                res.status(403).json({ message: 'user already exists' });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                User.create({
                    email,
                    username,
                    password: hashedPassword,
                    tag
                })
                    .then(createdUser => {
                        // success
                        const token = jwt.sign(
                            user.dataValues, 
                            process.env.ACCESS_TOKEN_SECRET, 
                            { expiresIn: '30d' }
                        );
                        res.status(200).json({ token });
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
            // no such user
            if (!user) {
                res.status(401).json({ message: 'no such user' });
            } else {
                bcrypt.compare(password, user.password, (err, result) => {
                    // success
                    if (result === true) {
                        const token = jwt.sign(
                            user.dataValues, 
                            process.env.ACCESS_TOKEN_SECRET, 
                            { expiresIn: '30d' }
                        );
                        res.status(200).json({ token });
                    } else {
                        // invalid password
                        res.status(401).json({ message: 'invalid password' });
                    }
                })
            }
        })
        .catch(err => console.log(err));
});

router.get('/logout', (req, res) => {
    res.status(200).json({ token: null }); // get rid of that later and rather use frontend logout (destroy token on cookie/localstorage)
    }
);



module.exports = router;