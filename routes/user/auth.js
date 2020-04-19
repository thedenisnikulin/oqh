const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const User = require('../../models/index').user;

// TODO: implement refresh token logic

router.post('/register', async (req, res, next) => {
    console.log(req.body)
    const { username, password, bio } = req.body;
    const user = User.findOne({
        where: {
            username
        }
    })
        .then(async (foundUser) => {
            if (foundUser) {
                // user already exists
                res.json({ message: 'user already exists' });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                User.create({
                    username,
                    password: hashedPassword,
                    bio,
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
                                username,
                                bio,
                                roomId: null
                            },
                            jwt: token
                        };
                        res.json({ data });
                        next();
                })
                    .catch(err => console.log(err));
            }
        })
});

router.post('/login', async (req, res, next) => {
    console.log(req.body)
    const { username, password } = req.body;
    const user = User.findOne({
        where: {
            username
        }
    })
        .then((foundUser) => {
            // no such user
            if (!foundUser) {
                res.json({ message: 'no such user' });
            } else {
                bcrypt.compare(password, foundUser.password, (err, result) => {
                    // success
                    if (result === true) {
                        const token = jwt.sign(
                            foundUser.dataValues, 
                            process.env.ACCESS_TOKEN_SECRET, 
                            { expiresIn: '30d' }
                        );
                        const data = {
                            user: {
                                username: foundUser.username,
                                bio: foundUser.bio,
                                roomId: foundUser.roomId
                            },
                            jwt: token
                        };
                        res.json({ data });
                        next();
                    } else {
                        // invalid password
                        res.json({ message: 'invalid password' });
                    }
                })
            }
        })
        .catch(err => console.log(err));
});



module.exports = router;