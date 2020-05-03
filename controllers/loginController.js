const express = require('express');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const User = require('../models/index').user;

module.exports = async (req, res, next) => {
    const { username, password } = req.body;
    User.findOne({ where: { username } })
        .then((foundUser) => {
            // no such user
            if (!foundUser) {
                res.json({ message: 'no such user' });
            } else {
                bcrypt.compare(password, foundUser.password, (err, result) => {
                    // success
                    if (err) res.json({ message: 'invalid password' });
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
        .catch(err => console.log("AUTH LOGIN: error " + err));
};