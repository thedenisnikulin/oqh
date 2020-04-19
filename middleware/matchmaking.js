const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../models/index').user;
const Room = require('../models/index').room;

router.post('/mm', async (req, res, next) => {
    const { user, topic, action } = req.body;
    // debug_createUsers().then(() => {
    //     debug_updateIsSearchingAll();
    // });
    
    //Room.findOne({where: {id: 'db33efad-a158-41f3-8a44-b4ac16011ad4'}, include: [{model: User}]}).then(res => res.users.map(user => console.log(user)))
    let userData = await User.findOne({where: {username: user.username}});
    console.log(userData)
    switch(action) {
        case 'start':
            userData.isSearching = true;
            userData.save();
            searchRoom(userData, topic);
            checkIfReady(req, res, next, userData);
            break;
        case 'break':
            userData.isSearching = false;
            userData.roomId = null;
            userData.save();
            break;
    }
});


const searchRoom = async (currentUser, topic) => {
    let foundRooms = await Room.findAll({ include: [{ model: User }] });
    let isRoomFound = false;

    for (let i = 0; i < foundRooms.length; i++) {
        if (foundRooms[i].topic === topic && foundRooms[i].users.length < 4) {
            foundRooms[i].users.push(currentUser)
            foundRooms[i].save();
            currentUser.roomId = foundRooms[i].id;
            currentUser.save();
            isRoomFound = true;
            break;
        }
    };
    if (isRoomFound === false) {
        Room.create({ include: [{ model: User }] })
            .then(async (createdRoom) => {
                let room = await Room.findOne({where:{id:createdRoom.id}, include: [{model: User}]})
                room.topic = topic;
                room.users.push(currentUser);
                room.save();
                currentUser.roomId = room.id;
                currentUser.save();
            })
    }
};

const checkIfReady = async (req, res, next, currentUser) => {
    let room = await Room.findOne({ 
        where: { id: currentUser.roomId },
        include: [{ model: User }]
    });
    console.log(room.dataValues.id);
    if (room.users.length === 4) {
        let usersInRoom = room.users.map(user => {
            user = {
                id,
                username,
                team,
                rank
            }
        });
        console.log('room\'s ready')
        res.json({ isMatchFound: true, room: { id: room.id, users: usersInRoom } });
    } else {
        console.log('room\'s not ready')
        res.json({ isMatchFound: false });
    }
}

const debug_createUsers = async () => {
    var users = [];
    for (let i = 1; i <= 35; i++) {
        users.push({
            username: `test${i}`,
            password: await bcrypt.hash(`test${i}`, 10),
            bio: 'hello'
        });
    };

    User.bulkCreate(users)
};

const debug_updateIsSearchingAll = () => {
    for (let i = 1; i <= 31; i++) {
        User.findOne({
            where: {
                username: `test${i}`
            }
        }).then(foundUser => {
            foundUser.isSearching = true;
            foundUser.save();
        });
    }
}

module.exports = router