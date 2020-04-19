const router = require('express').Router();
const io = require('socket.io').listen(8000);

const User = require('../../models/index').user;
const Room = require('../../models/index').room;
const chatMessage = require('../../models/index').chatMessage;

router.post('/room', async (req, res, next) => {
    const { roomId } = req.body;
    let chatMessagesInRoom = await chatMessage.findAll({ where: { roomId }});
    let usersInRoom = await User.findAll({ where: { roomId } });
    console.log('in room ' + require('util').inspect(usersInRoom))
    let readyMessages = [];
    let safeUsers = [];
    usersInRoom.forEach(user => {
        user = {
            id: user.dataValues.id,
            username: user.dataValues.username,
            bio: user.dataValues.bio
        };
        safeUsers.push(user);
        // this shit gives unsorted messages
        chatMessagesInRoom.forEach(msg => {
            if (msg.senderId === user.id) {
                readyMessages.push({
                    message: msg.dataValues.message,
                    sender: user
                })
            }
        });
    });
    console.log('safe ' + require('util').inspect(safeUsers))
    console.log('msgs ' + require('util').inspect(readyMessages))
    res.json({ users: safeUsers, messages: readyMessages }); 
});

io.on('connection', async (client) => {
    let senderId;
    let roomId;
    client.on('init', (init) => {
        senderId = init.userData.id;
        roomId = init.room;
    });
    console.log('room connected');
    client.on('message', (msg) => {
        console.log(msg);
        console.log(senderId + ' ' + roomId)
        chatMessage.create({ 
            message: msg.message,
            senderId: msg.sender.id,
            roomId
        });
    });
})

module.exports = router;