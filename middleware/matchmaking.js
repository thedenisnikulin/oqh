const express = require('express');
const router = express.Router();

const User = require('../models/index').user;
const Room = require('../models/index').room;

// each room have 4 teams with 4 members.
// each member have his class (tag) - 2 developers with "backend" tag and 2 with "frontend" tag
// 1 room - 4 teams - 4 members
const frontend_tag = 'frontend developer';
const backend_tag = 'backend developer';

router.post('/', async (req, res, next) => {
    const { user, action } = req.body;
    Room.findOne({where: {id: 'db33efad-a158-41f3-8a44-b4ac16011ad4'}, include: [{model: User}]}).then(res => res.users.map(user => console.log(user.tag)))
    let userData = await User.findOne({where: {email: user.email}});
    switch(action) {
        case 'add_to_pool':
            handleUserSearchingPool(userData, 1);
            break;
        case 'remove_from_pool':
            handleUserSearchingPool(userData, 0)
            break;
        case 'search_room':
            searchRoom(req, res, next, userData);
            break;
        case 'check_if_ready':
            checkIfReady(req, res, next, userData);
            break;
    }
});


const handleUserSearchingPool = (user, action) => {
    // action === 1 (add to searching pool)
    // action === 0 (remove from searching pool)
    User.findOne({where: {email: user.email}})
        .then(user => {
            if (action === 1) {
                user.isSearching = true;
            }
            else if (action === 0) {
                user.isSearching = false;
            }
            user.save();
        })
        .catch(err => console.log(err))
};


const searchRoom = async (req, res, next, currentUser) => {
    // look for any rooms
    let numberOfRooms = await Room.count();
    // no rooms found - create one and join
    if (numberOfRooms === 0) {
        let createdRoom = await Room.create({ include: [{ model: User }] });
        let room = await Room.findOne({where:{id:createdRoom.id}, include: [{model: User}]})
        room.users.push(currentUser);
        room.save();
        currentUser.roomId = room.id;
        currentUser.save();

    } else {
        // rooms found - look for available one and join
        let foundRooms = await Room.findAll({ include: [{ model: User }] });
        let isRoomFound = false;

        for (let i = 0; i < foundRooms.length; i++) {
            let sameTaggedUsers = 0;
            foundRooms[i].users.forEach(user => {
                if (user.dataValues.tag === currentUser.dataValues.tag) {
                    sameTaggedUsers++;
                }
            });
            if (sameTaggedUsers < 8) {
                foundRooms[i].users.push(currentUser)
                foundRooms[i].save();
                currentUser.roomId = foundRooms[i].id;
                currentUser.save();
                isRoomFound = true;
                break;
            }
        };
        // no available ones - create one and join
        if (isRoomFound === false) {
            Room.create({ include: [{ model: User }] })
                .then(async (createdRoom) => {
                    let room = await Room.findOne({where:{id:createdRoom.id}, include: [{model: User}]})
                    room.users.push(currentUser);
                    room.save();
                    currentUser.roomId = room.id;
                    currentUser.save();
                })
        }
    }
};

const checkIfReady = async (req, res, next, currentUser) => {
    let room = await Room.findOne({ 
        where: { id: currentUser.roomId },
        include: [{ model: User }]
    });
    if (room.users.length !== 16) {
        res.json({ isMatchFound: false });
    } else {
        // map users by teams: 4 teams with 4 members
        let teams = [
            // 2 frontenders and 2 backenders in each team
            [2, 2], [2, 2], // team A, team B
            [2, 2], [2, 2]  // team C, team D
        ];
        const teamTags = ['A', 'B', 'C', 'D'];

        room.users.map(user => {
            let isSet = false;
            let tagIndex = user.tag === frontend_tag ? 0 : 1;
            for (let teamIndex = 0; teamIndex < teams.length; teamIndex++) {
                if (isSet) break;
                if (teams[teamIndex][tagIndex] !== 0) {
                    teams[teamIndex][tagIndex]--;
                    user.team = teamTags[teamIndex]
                    user.save();
                    isSet = true;
                }
            }
        })
        console.log('found')
        res.json({ isMatchFound: true });
    }
}

const debug_createUsers = async () => {
    var users = [];
    for (let i = 1; i <= 24; i++) {
        let tag = i % 2 === 0 ? frontend_tag : backend_tag
        users.push({
            email: `test${i}@gmail.com`,
            username: `test${i}`,
            password: `test${i}`,
            tag: tag
        });
    };

    User.bulkCreate(users)
};

const debug_updateIsSearchingAll = () => {
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