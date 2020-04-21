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
    switch(action) {
        case 'start':
            userData.isSearching = true;
            await userData.save()
            console.log('saved');
            await searchRoom(userData, topic)
            console.log('searched')
            let result = await checkIfReady(userData)
            console.log('checked ')
            console.log(result)
            break;
        case 'break':
            userData.isSearching = false;
            userData.roomId = null;
            userData.save();
            break;
    }
});

// when the room is ready, only the last joined member gets 'found' message, but
// others get 'not found'
// TODO: divide search and check into 2 different actions
// TODO: send actions to find a room, if the room is found - send actions to check

const searchRoom = async (currentUser, topic) => {
    let foundRooms = await Room.findAll({ include: [{ model: User }] });
    let isRoomFound = false;

    for (let i = 0; i < foundRooms.length; i++) {
        console.log('found roomz '+ require('util').inspect(foundRooms))
        console.log(foundRooms[i].id)
        console.log(foundRooms[i].users.length)
        if (foundRooms[i].topic === topic && foundRooms[i].users.length < 4) {
            console.log('gotcha')
            foundRooms[i].users.push(currentUser)
            await foundRooms[i].save()
            currentUser.roomId = foundRooms[i].id;
            await currentUser.save()
            isRoomFound = true;
            await User.findOne({where: {id: currentUser.id}}).then((u) => console.log('u from search' + require('util').inspect(u)))
            break;
        }
    };
    if (isRoomFound === false) {
        Room.create({ include: [{ model: User }] })
            .then(async (createdRoom) => {
                let room = await Room.findOne({where:{id:createdRoom.id}, include: [{model: User}]})
                room.topic = topic;
                room.users.push(currentUser);
                await room.save();
                currentUser.roomId = room.id;
                await currentUser.save();
            })
    }
};

const checkIfReady = async (currentUser) => {
    console.log('user from check: ' + require('util').inspect(currentUser))
    let room = await Room.findOne({ 
        where: { id: currentUser.roomId },
        include: [{ model: User }]
    });
    console.log(room.users);
    if (room.users.length === 4) {
        let usersInRoom = [];
        room.users.forEach(user => {
            usersInRoom.push({
                id: user.id,
                username: user.username,
                bio: user.bio
            }
        )});
        console.log(usersInRoom)
        console.log('room\'s ready')
        return({ isMatchFound: true, room: { id: room.id, users: usersInRoom } });
    } else {
        console.log('room\'s not ready')
        return({ isMatchFound: false });
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