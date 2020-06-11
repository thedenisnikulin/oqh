const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const User = require('../models/index').user;

module.exports = async (req, res, next) => {
    const { username, password, bio } = req.body;
    User.findOne({ where: { username } })
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
                    .catch(err => console.log("AUTH REGISTER: error " + err));
            }
        })
};