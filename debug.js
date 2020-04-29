
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

const findRoom = () => {
    return p
    .then((foundRooms) => {
        console.log('------FINDING')
        let breakLoop = false;
        for (let room of foundRooms) {
            if (breakLoop) break;
            console.log('in loop')
            if (true) {
                // it will break the for loop next time because a room is found
                breakLoop = true;
                console.log('FINDING: got a match')
                return Promise.all([
                    room.u,
                ])
            }
        };
    }).then((thing) => {
        console.log('_____FINDING RESULT BELOW');
        console.log(thing)
        if (!thing) {
            return false;
        } else {
            return true;
        }
        // switch to FALSE to access next 'then'
    }).catch(e => {
        console.log('ERROR: during finding a room occured');
        console.log(e);
    })
    .then((isRoomFound) => {
        if (!isRoomFound) {
            console.log("no room found")
            // this is a bad way to access users in room (i mean create and find)
            return pSingle
            .then((foundRoom) => {
                console.log('------CREATION')
                console.log(foundRoom)
                return Promise.all([
                    foundRoom.u,
                ]);
            }).then((thing) => {
                console.log('______CREARTION RESULT BELOW');
                console.log(thing);
                return('SUCCESS: CREATING');
            }).catch(e => {
                console.log('ERROR: during creation of room occured')
                console.log(e)
                return('FAILURE: CREATING');
            })
        } else {
            return('SUCCESS FINDING');
        }
    })
};

findRoom().then((value) => {
    console.log('out of p: ' + value)
})