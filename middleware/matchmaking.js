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
    
    let userData = await User.findOne({where: {username: user.username}});
    switch(action) {
        case 'find_room':
            userData.isSearching = true;
            await userData.save()
            let isRoomFound = await findRoom(userData, topic)
            console.log('mm main: room found')
            res.json({ isRoomFound })
            break;
        case 'check_if_ready':
            let roomDataContainer = await checkIfReady(userData);
            console.log('mm main: room checked') 
            res.json(roomDataContainer);
            break;
        case 'get_room_id':
            res.json(userData.roomId)
            break;
        case 'get_users_searching':
            let usersSearching = await User.count({ where: { isSearching: true } });
            console.log('mm main: people searching: ' + usersSearching)
            res.json(usersSearching)
        case 'break':
            userData.isSearching = false;
            userData.roomId = null;
            await userData.save();
            break;
    }
});


const findRoom = (currentUser, topic) => {
    return Room.findAll({ include: [{ model: User }] })
    .then((foundRooms) => {
        console.log('----START FINDING----')
        let breakLoop = false;
        for (let room of foundRooms) {
            if (breakLoop) break;
            console.log('findRoom: found rooms count: '+ foundRooms.length)
            console.log('findRoom: room id: '+ room.id)
            console.log('findRoom: count users: '+ room.users.length)
            if (room.topic === topic && room.users.length < 4) {
                // it will break the for loop next time because a room is found
                breakLoop = true; 
                console.log('findRoom: got a match')
                room.users.push(currentUser);
                currentUser.roomId = room.id;
                return Promise.all([
                    room.save(),
                    currentUser.save()
                ])
            }
        };
    }).then((resultOfFindingAnyRooms) => {
        console.log('----STOP FINDING----')
        if (!resultOfFindingAnyRooms) {
            return false;
        } else {
            return true;
        };
    }).catch(e => {
        console.log('error during adding user to room occured');
        console.log(e);
    }).then((isRoomFound) => {
        if (!isRoomFound) {
            console.log("NO ROOM FOUND")
            return Room.create({ include: [{ model: User }] })
            .then((room) => {
                return Room.findOne({ where: { id: room.id }, include: [{ model: User }]})
            }).then((foundRoom) => {
                console.log('----START CREATION----')
                foundRoom.topic = topic;
                foundRoom.users.push(currentUser);
                currentUser.roomId = foundRoom.id;
                return Promise.all([
                    foundRoom.save(),
                    currentUser.save()
                ]);
            }).then((resultOfAddingUserToRoom) => {
                console.log('findRoom: room created, id : ' + resultOfAddingUserToRoom[0])
                console.log('---STOP CREATION---')
                return(true);
            }).catch(e => {
                console.log('findRoom: A error during creating room occured')
                console.log(e)
                return(false);
            })
        } else {
            console.log('----STOP----')
            return(true);
        }
    })
};

const checkIfReady = (currentUser) => {
    return Room.findOne({
        where: { id: currentUser.roomId },
        include: [{ model: User }]
    }).then(room => {
        console.log('checkIfReady: user id: ' + currentUser.username)
        console.log('checkIfReady: room id: ' + room.id);
        console.log('checkIfReady: users in room count: ' + room.users.length);
        if (room.users.length === 4) {
            let usersInRoom = [];
            room.users.forEach(user => {
                usersInRoom.push({
                    id: user.id,
                    username: user.username,
                    bio: user.bio
                }
            )});
            console.log('checkIfReady: room\'s ready')
            console.log(usersInRoom)
            return({ 
                isRoomReady: true, 
                room: { 
                    id: room.id, 
                    topic: room.topic, 
                    users: usersInRoom 
                } 
            });
        } else {
            console.log('checkIfReady: room\'s not ready')
            return({ isRoomReady: false });
        }
    }).catch(e => {
        console.log('checkIfReady: A error during checking occured');
        console.log(e)
    })
}

const debug_createUsers = async () => {
    var users = [];
    for (let i = 1; i <= 5; i++) {
        users.push({
            username: `test${i}`,
            password: await bcrypt.hash(`test${i}`, 10),
            bio: 'hello'
        });
    };

    await User.bulkCreate(users)
};

const debug_updateIsSearchingAll = async () => {
    for (let i = 1; i <= 5; i++) {
        User.findOne({
            where: {
                username: `test${i}`
            }
        }).then(async (foundUser) => {
            foundUser.isSearching = true;
            await foundUser.save();
        });
    }
}

module.exports = router