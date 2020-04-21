const router = require('express').Router();
const io = require('socket.io').listen(8000);

const User = require('../../models/index').user;
const Room = require('../../models/index').room;
const chatMessage = require('../../models/index').chatMessage;

router.post('/room', async (req, res, next) => {
    
});

io.on('connection', async (client) => {
    let roomId;
    console.log('user joined');

    client.on('init', async () => {
        let chatMessagesInRoom = await chatMessage.findAll({ where: { roomId }});
        let usersInRoom = await User.findAll({ where: { roomId } });
        
        let readyMessages = [];
        let safeUsers = [];
        usersInRoom.forEach(user => {
            user = {
                id: user.dataValues.id,
                username: user.dataValues.username,
                bio: user.dataValues.bio
            };
            safeUsers.push(user);
        });
        chatMessagesInRoom.map(msg => {
            for(let i=0; i<safeUsers.length; i++) {
                if (safeUsers[i].id === msg.senderId) {
                    readyMessages.push({
                        message: msg.dataValues.message,
                        sender: safeUsers[i]
                    })
                }
            }
        });
        console.log(readyMessages)
        client.emit('init', { users: safeUsers, messages: readyMessages })
    });

    client.on('connectRoom', (room) => {
        roomId = room;
        client.join(room);
    })

    client.on('message', (msg) => {

        chatMessage.create({ 
            message: msg.message,
            senderId: msg.sender.id,
            roomId
        });
        
        io.to(roomId).emit('message', {
            message: msg.message,
            sender: msg.sender
        });
    });

    client.on('disconnect', () => {
        client.removeAllListeners(roomId);
    })
})

module.exports = router;