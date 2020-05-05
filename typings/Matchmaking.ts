const User = require('../models/index').user;
const Room = require('../models/index').room;
import { IUserData, IRoomData } from './types';

export default class Matchmaking {
    public user: IUserData;
    public roomTopic: string;

    constructor(user: IUserData, roomTopic: string) {
        this.user = user;
        this.roomTopic = roomTopic;
    }

    public async findRoom(): Promise<boolean> {
        try {
            await User.update(
                { isSearching: true },
                { where: { id: this.user.id } }
            );
            let foundRooms: Array<IRoomData> = await Room.findAll({ include: [{ model: User }] });
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
                    await Room.update(
                        { users: updatedRoomUsers },
                        { where: { id: room.id } }
                    );
                    await User.update(
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
            const r = await Room.create({ include: [{ model: User }] });
            const room = await Room.findOne({ where: { id: r.id }, include: [{ model: User }] });
            console.log('----START CREATION----')
            let updatedRoomUsers = room.users.push(this.user);
            await Room.update(
                {
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
        const room = await Room.findOne({
            where: { id: this.user.roomId },
            include: [{ model: User }]
        });
        console.log('checkIfReady: room id: ' + room.id);
        console.log('checkIfReady: users in room count: ' + room.users.length);
        if (room.users.length === 4) {
            let usersInRoom: Array<object> = [];
            room.users.forEach((user: IUserData)=> {
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