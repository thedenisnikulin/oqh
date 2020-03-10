const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')

const User = require('../../models/index').models.User;

router.post('/', async (req, res) => {
    const { username, password, email } = req.body;
    console.log([username, password, email])
    const user = User.findAll({
        where: {
            email
        }
    });

    if (user) {
        return res.status(400).json({ message: 'User is already exist' })
    };

    const hashedPassword = await bcrypt.hash(password, 10);
    
    User.create({
        username,
        password: hashedPassword,
        email
    })
        .then(user => res.status(201))
        .catch(err => console.log(err));

});

module.exports = router;