const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')

const User = require('../../models/index').User;

router.post('/', async (req, res) => {
    console.log(req.body)
    const { username, password, email } = req.body;
    const user = User.findOne({
        where: {
            email
        }
    })
        .then(async (result) => {
            if (result) {
                return res.status(400).json({ message: 'User is already exist' })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                User.create({
                    username,
                    password: hashedPassword,
                    email
                })
                    .then(user => res.status(201).json({ message: 'User created successfully!' }))
                    .catch(err => console.log(err));
            }
        })

    

});

module.exports = router;