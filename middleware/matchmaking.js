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
        case 'find_room':
            userData.isSearching = true;
            await userData.save()
            let isRoomFound = await findRoom(userData, topic)
            console.log('mm main: room found')
            res.json(isRoomFound)
            break;
        case 'check_if_ready':
            let isRoomReady = await checkIfReady(userData);
            console.log('mm main: room checked') 
            console.log(isRoomReady)     
            res.json(isRoomReady);
            break;
        case 'get_room_id':
            res.json(userData.roomId)
            break;
        case 'break':
            userData.isSearching = false;
            userData.roomId = null;
            await userData.save();
            break;
    }
});

// when the room is ready, only the last joined member gets 'found' message, but
// others get 'not found'
// TODO: divide search and check into 2 different actions
// TODO: send actions to find a room, if the room is found - send actions to check

const findRoom = async (currentUser, topic) => {
    let foundRooms = await Room.findAll({ include: [{ model: User }] });
    let isRoomFound = false;

    for (let i = 0; i < foundRooms.length; i++) {
        console.log('findRoom: found roomz '+ require('util').inspect(foundRooms))
        console.log(foundRooms[i].id)
        console.log(foundRooms[i].users.length)
        if (foundRooms[i].topic === topic && foundRooms[i].users.length < 4) {
            console.log('findRoom: gotcha')
            foundRooms[i].users.push(currentUser)
            await foundRooms[i].save()
            currentUser.roomId = foundRooms[i].id;
            await currentUser.save()
            isRoomFound = true;
            console.log('findRoom: found room id is ' + foundRooms[i].id)
            await User.findOne({where: {id: currentUser.id}}).then((u) => console.log('findRoom: u from search' + require('util').inspect(u)))
            break;
        }
    };
    if (isRoomFound === false) {
        Room.create({ include: [{ model: User }] })
            .then(async (createdRoom) => {
                createdRoom.topic = topic;
                createdRoom.users.push(currentUser);
                await createdRoom.save();
                currentUser.roomId = createdRoom.id;
                await currentUser.save();
                isRoomFound = true;
                console.log('findRoom: created room id is ' + createdRoom.id)
            })
            .catch(err => {
                console.log('findRoom: A error during finding room occured')
                console.log(err)
                isRoomFound = false;
            })
    }
    return({ isRoomFound: isRoomFound })
};

const checkIfReady = async (currentUser) => {
    console.log('checkIfReady: user - ' + require('util').inspect(currentUser))
    let room = await Room.findOne({ 
        where: { id: currentUser.roomId },
        include: [{ model: User }]
    });
    console.log('checkIfReady: room users -' + require('util').inspect(room.users));
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
        console.log('checkIfReady: room\'s ready')
        return({ isRoomReady: true, room: { id: room.id, topic: room.topic, users: usersInRoom } });
    } else {
        console.log('checkIfReady: room\'s not ready')
        return({ isRoomReady: false });
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