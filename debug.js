
// let user = { 
//     id: 'us1',
//     roomId: null,
//  }

// const searchRoom = async (currentUser, topic) => {
//     let rooms = [
//         {id: 1, topic: 'code', users: [{}, {}, {}, {}]},
//         {id: 2, topic: 'code', users: [{}, {}, {}, {}]}
//     ];
//     let isRoomFound = false;
    
//     for (let i = 0; i < rooms.length; i++) {
//         if (rooms[i].topic === topic && rooms[i].users.length < 4) {
//             rooms[i].users.push(currentUser)
//             currentUser.roomId = rooms[i].id;
//             isRoomFound = true;
//             break;
//         }
//     };
//     if (isRoomFound === false) {
//         let room = {id: 3, topic: 'code', users: []};
//         room.topic = topic;
//         room.users.push(currentUser);
//         rooms.push(room)
//         currentUser.roomId = room.id;
//     }
//     console.log(rooms);
// };

// searchRoom(user, 'code');
// console.log(user)
// console.log('\x1b[41m', 'lmao')


let v = true;
let hello;

let p = new Promise((resolve, reject) => {
    setTimeout(() => {
        if (v === true) {
            resolve([
                {u: new Promise((reso) => reso(['u1', 'u2']))}, 
                {u: new Promise((reso) => reso(['u1', 'u2']))}, 
                {u: new Promise((reso) => reso(['u1', 'u2']))}, 
                {u: new Promise((reso) => reso(['u1', 'u2']))}
            ])
        } else {
            reject('not okay')
        }
    }, 2000)
});

let pSingle = new Promise((resolve, reject) => {
    setTimeout(() => {
        if (v === true) {
            resolve(
                {u: new Promise((reso) => reso(['u1', 'u2']))}
            )
        } else {
            reject('not okay')
        }
    }, 2000)
});


const checkIfReady = (currentUser) => {
    return Room.findOne({
        where: { id: currentUser.roomId },
        include: [{ model: User }]
    }).then(room => {
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
            console.log(usersInRoom)
            console.log('checkIfReady: room\'s ready')
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
    })   
}

checkIfReady().then((value) => {
    console.log('out of p: ' + value)
})