const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')

const User = require('../../models/index').User;

router.get('/register', (req, res, next) => {
    
})

router.get('/login', (req, res, next) => {
    
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
            if (!user) {
                return res.status(400).json({ message: 'User is not registered' }) // must redirect
            } else {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (result === true) { 
                        return res.status(201).json({ message: 'Logged in!' }) 
                    } else { 
                        res.status(400).json({ message: 'Incorrect password!' }) 
                    }
                })
            }
        })
});

module.exports = router;