const User = require('../models/index').user;

module.exports = async (req, res, next) => {
    const { valueToAdd, user } = req.body;
    console.log('rep: to add: ' + valueToAdd);
    console.log('rep: u: ')
    console.log(user)

    User.findOne({ where: { username: user.username } })
        .then(async (u) => {
            u.rep = u.rep + valueToAdd;
            await u.save();
        }).catch(e => console.log(e))
};