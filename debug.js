
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
            resolve('okay')
        } else {
            reject('not okay')
        }
    }, 2000)
});


let lol = async () => {
    let res = await p;
    return(res)
};

let func = () => {
    lol().then((o) => {
        console.log(o)
        console.log('after promise')
    })
}

func()



const findRoom = (currentUser, topic) => {
    return Room.findAll({ include: [{ model: User }] })
    .then((foundRooms) => {
        let breakLoop = false;
        for (let room of foundRooms) {
            if (breakLoop) break;
            console.log('findRoom: found roomz '+ require('util').inspect(foundRooms))
            console.log('findRoom: room id '+ room.id)
            console.log('findRoom: count users '+ room.users.length)
            if (room.topic === topic && room.users.length < 4) {
                // it will break the for loop next time because a room is found
                breakLoop = true;
                console.log('findRoom: got a match')
                room.users.push(currentUser);
                currentUser.roomId = room.id;
                Promise.all([
                    room.save(),
                    currentUser.save()
                ]).then(() => {
                    console.log('findRoom: room is savedm,id: ' + room.id)
                    return(true);
                }).catch(e => {
                    console.log('error during adding user to room occured');
                    console.log(e);
                }).finally(() => {
                    User.findOne({where: {id: currentUser.id}}).then((u) => console.log('findRoom: u from search' + require('util').inspect(u)))
                })
            }
        };
        return(false);
    }).then((isRoomFound) => {
        if (!isRoomFound) {
            // this is a bad way to access users in room (i mean create and find)
            return Room.create({ include: [{ model: User }] })
            .then((room) => {
                return Room.findOne({ 
                    where: { id: room.id }, include: [{ model: User }] 
                }).then(async (foundRoom) => {
                    console.log(foundRoom.users.length)
                    foundRoom.topic = topic;
                    foundRoom.users.push(currentUser);
                    currentUser.roomId = foundRoom.id;
                    Promise.all([
                        foundRoom.save(),
                        currentUser.save()
                    ]).then(() => {
                        console.log('findRoom: room created, id: ' + foundRoom.id)
                        return(true);
                    }).catch(e => console.log(e))
                }).catch(e => {
                    console.log('findRoom: A error during finding room occured')
                    console.log(e)
                    return(false);
                })
            })
        } else {
            return true;
        }
    })
};