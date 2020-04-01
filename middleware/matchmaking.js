const express = require('express');
const router = express.Router();

const User = require('../models/index').user;
const Room = require('../models/index').room;


router.post('/', (req, res, next) => {
    const user = req.user;
    console.log(user)
    // addUserToSearchingPool(user);
    // debug_updateIsSearchingAll();
    // User.findOne({where: {email: user.email}})
    //     .then(foundUser => {
    //         matchmake(req, res, next, foundUser);
    //     })
    
});

function addUserToSearchingPool(user) {
    User.findOne({where: {email: user.email}})
        .then(foundUser => {
            foundUser.isSearching = true;
            foundUser.save();
            // User.update({ isSearching: true }, { where: { id: result.id } });
        })
        .catch(err => console.log(err))
};

// each room have 4 teams with 4 members.
// each member have his class (tag) - 2 developers with "backend" tag and 2 with "frontend" tag
// 1 room - 4 teams - 4 members

function matchmake(req, res, next, currentUser) {

    const getLimit = (tag) => currentUser.dataValues.tag === tag ? 7 : 8;
    let room = [];
    room.push(currentUser);

    User.findAll({ where: {
        isSearching: true,
        tag: 'frontend developer'
    }, limit: getLimit('frontend developer') })
        .then(foundFrontendUsers => {
            User.findAll({ where: {
                isSearching: true,
                tag: 'backend developer'
            }, limit: getLimit('backend developer') })
            .then(foundBackendUsers => {
                foundBackendUsers.forEach(e => room.push(e));
                foundFrontendUsers.forEach(e => room.push(e));
                if (room.length === 16) {
                    Room.create({ include: [{model: User}] })
                        .then(createdRoom => {
                            createdRoom.setUsers(room);
                            Room.findOne({where:{id:createdRoom.id}, include: [{model: User}]})
                                .then(hello => console.log(hello))
                        })
                    res.json({ isMatchFound: true });
                } else {
                    res.json({ isMatchFound: false });
                }
            });
        });
};

function debug_createUsers() {
    var users = [];
    for (let i = 1; i <= 24; i++) {
        let tag = i % 2 === 0 ? 'frontend developer' : 'backend developer'
        users.push({
            email: `test${i}@gmail.com`,
            username: `test${i}`,
            password: `test${i}`,
            tag: tag
        });
    };

    User.bulkCreate(users)
};

function debug_updateIsSearchingAll() {
    for (let i = 1; i <= 24; i++) {
        User.findOne({
            where: {
                email: `test${i}@gmail.com`
            }
        }).then(foundUser => {
            foundUser.isSearching = true;
            foundUser.save();
        });
    }
}

module.exports = router
