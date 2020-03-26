const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const User = require('../../models/index').User;

// TODO: implement refresh token later 'cos now I want to focus on the main logic

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
                res.json({ message: 'user already exists' });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                User.create({
                    email,
                    username,
                    password: hashedPassword,
                    tag,
                    rank: 0
                })
                    .then(createdUser => {
                        // success
                        const token = jwt.sign(
                            createdUser.dataValues, 
                            process.env.ACCESS_TOKEN_SECRET, 
                            { expiresIn: '30d' }
                        );
                        const data = {
                            user: {
                                email,
                                username,
                                tag,
                                rank
                            },
                            jwt: token
                        };
                        res.json({ data });
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
                res.json({ message: 'no such user' });
            } else {
                bcrypt.compare(password, user.password, (err, result) => {
                    // success
                    if (result === true) {
                        const token = jwt.sign(
                            user.dataValues, 
                            process.env.ACCESS_TOKEN_SECRET, 
                            { expiresIn: '30d' }
                        );
                        const data = {
                            user: {
                                email: user.email,
                                username: user.username,
                                tag: user.tag,
                                rank: user.rank
                            },
                            jwt: token
                        };
                        console.log(data);
                        req.userData = data;
                        res.json({ data });
                    } else {
                        // invalid password
                        res.json({ message: 'invalid password' });
                    }
                })
            }
        })
        .catch(err => console.log(err));
});

router.get('/logout', (req, res) => {
    res.json({ jwt: null }); // get rid of that later and rather use frontend logout (destroy token on cookie/localstorage)
    }
);



module.exports = router;