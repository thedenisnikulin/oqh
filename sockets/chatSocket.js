
const Room = require('../models/index').room;
const chatMessage = require('../models/index').chatMessage;

let sockets = {};

sockets.init = (server, func) => {
    sockets.io = require('socket.io').listen(server);
    sockets.io.on('connection', func)
}

sockets.main = async (client) => {
    let roomId;
    console.log('SOCKET: user joined');

    client.on('init', async () => {
        console.log('SOCKET: init')
        let chatMessagesInRoom = await chatMessage.findAll({ where: { roomId }});
        let usersInRoom = await User.findAll({ where: { roomId } });
        
        let readyMessages = [];
        
        chatMessagesInRoom.map(msg => {
            for(let i = 0; i < usersInRoom.length; i++) {
                if (usersInRoom[i].dataValues.id === msg.senderId) {
                    readyMessages.push({
                        message: msg.dataValues.message,
                        sender: usersInRoom[i].dataValues.username
                    })
                }
            }
        });
        console.log('SOCKET: init messages ' + require('util').inspect(readyMessages))
        console.log('SOCKET: users count ' + require('util').inspect(usersInRoom.length))
        client.emit('init', { messages: readyMessages });
    });

    client.on('connectRoom', (room) => {
        roomId = room;
        client.join(room);
        console.log('SOCKET: connectRoom: roomId: ' + roomId)
    })

    client.on('message', (msg) => {
        chatMessage.create({ 
            message: msg.message,
            senderId: msg.sender.id,
            roomId
        });
        
        sockets.io.to(roomId).emit('message', {
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
        console.log(username + ' from disconnectUser ')
        let user = await User.findOne({ where: { username } })
        user.isSearching = false;
        user.roomId = null;
        await userData.save();
    })
};

module.exports = sockets;