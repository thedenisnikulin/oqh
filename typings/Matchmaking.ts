import db from './models/index';
import { UserModel, RoomModel, ChatMessageModel } from './models/index';

export default class Matchmaking {
    public user: UserModel;
    public roomTopic: string;

    constructor(user: UserModel, roomTopic: string) {
        this.user = user;
        this.roomTopic = roomTopic;
    };

    public static async initUser(username: string): Promise<UserModel> {
        try {
            const user = await db.User.findOne({
                where: {
                    username: username
                }
            });
            if (user) {
                return user;
            } else {
                Promise.reject();
            }
        } catch(e) {
            console.log(e)
        }
    }

    public async findRoom(): Promise<boolean> {
        try {
            await db.User.update(
                { isSearching: true },
                { where: { id: this.user.id } }
            );
            let foundRooms: Array<RoomModel> = await db.Room.findAll({ include: [{ model: db.User }] });
            console.log('----START FINDING----');
            let breakLoop: boolean = false;
            for (let room of foundRooms) {
                if (breakLoop) break;
                console.log('findRoom: found rooms count: '+ foundRooms.length)
                console.log('findRoom: room id: '+ room.id)
                console.log('findRoom: count users: '+ room.users.length)
                if (room.topic === this.roomTopic && room.users.length < 4) {
                    breakLoop = true;
                    console.log('findRoom: got a match');
                    let updatedRoomUsers = room.users.push(this.user);
                    await db.Room.update(
                        { users: updatedRoomUsers },
                        { where: { id: room.id } }
                    );
                    await db.User.update(
                        { roomId: room.id },
                        { where: { id: this.user.id } }
                    );
                    return true;
                };
            };
            return false;
        } catch(e) {
            console.log(e);
            return false;
        }
    };

    public async createRoom(): Promise<boolean> {
        console.log("NO ROOM FOUND")
        try {
            const r = await db.Room.create({ include: [{ model: db.User }] });
            const room = await db.Room.findOne({ where: { id: r.id }, include: [{ model: db.User }] });
            if (!r || !room) {
                Promise.reject();
                return false;
            }
            console.log('----START CREATION----')
            let updatedRoomUsers = room.users.push(this.user);
            await db.Room.update({
                    topic: this.roomTopic,
                    users: updatedRoomUsers
                },
                { where: { id: room.id } }
            );
            return true;
        } catch(e) {
            console.log(e);
            return false;
        };
    };

    public async confirmRoomReadiness(): Promise<object> {
        const room = await db.Room.findOne({
            where: { id: this.user.roomId },
            include: [{ model: db.User }]
        });
        if (!room) {
            Promise.reject();
            return({});
        }
        console.log('checkIfReady: room id: ' + room.id);
        console.log('checkIfReady: users in room count: ' + room.users.length);
        if (room.users.length === 4) {
            let usersInRoom: Array<object> = [];
            room.users.forEach((user: UserModel)=> {
                usersInRoom.push({
                    id: user.id,
                    username: user.username,
                    bio: user.bio
                });
            });
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
    }
}