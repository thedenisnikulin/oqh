const router = require('express').Router();
const io = require('socket.io').listen(8000);

const User = require('../../models/index').user;
const Room = require('../../models/index').room;
const chatMessage = require('../../models/index').chatMessage;

router.post('/room', async (req, res, next) => {
    const { valueToAdd, user } = req.body;
    User.update(
        { rep: rep + valueToAdd },
        { 
            where: {
                username: user.username
            }
        }
    ).catch(e => console.log(e));
});

io.on('connection', async (client) => {
    let roomId;
    console.log('SOCKET: user joined');

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
        console.log('SOCKET: init messages ' + require('util').inspect(readyMessages))
        client.emit('init', { users: safeUsers, messages: readyMessages })
    });

    client.on('connectRoom', (room) => {
        roomId = room;
        client.join(room);
        console.log('SOCKET: connectRoom: roomId - ')
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

    client.on('disconnectRoom', () => {
        client.removeAllListeners(roomId);
        chatMessage.destroy({ where: { roomId } });
        Room.destroy({ where: { roomId } });
    })
    client.on('disconnectUser', async (username) => {
        let user = await User.findOne({ where: { username } })
        user.isSearching = false;
        user.roomId = null;
        await userData.save();
    })
})

module.exports = router;