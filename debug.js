
let user = { 
    id: 'us1',
    roomId: null,
 }

const searchRoom = async (currentUser, topic) => {
    let rooms = [
        {id: 1, topic: 'code', users: [{}, {}, {}, {}]},
        {id: 2, topic: 'code', users: [{}, {}, {}, {}]}
    ];
    let isRoomFound = false;
    
    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].topic === topic && rooms[i].users.length < 4) {
            rooms[i].users.push(currentUser)
            currentUser.roomId = rooms[i].id;
            isRoomFound = true;
            break;
        }
    };
    if (isRoomFound === false) {
        let room = {id: 3, topic: 'code', users: []};
        room.topic = topic;
        room.users.push(currentUser);
        rooms.push(room)
        currentUser.roomId = room.id;
    }
    console.log(rooms);
};

searchRoom(user, 'code');
console.log(user)
console.log('\x1b[41m', 'lmao')