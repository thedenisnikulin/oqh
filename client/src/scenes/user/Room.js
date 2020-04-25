import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

let socket;

const Room = (props) => {
    
    return(
        <div>
            <Chat userDataState={props.userDataState}/>
        </div>
    );
};

const Chat = (props) => {
    const { userData, setUserData } = props;
    const { room, setRoom } = props;
    const [ message, setMessage ] = useState('');
    const [ history, setHistory ] = useState([]);

    // initialize data
    useEffect(() => {
        socket = io.connect('http://localhost:8000');
        console.log(userData)
        socket.emit('connectRoom', userData.roomId);
        socket.emit('init');
        socket.on('init', (initData) => {
            setHistory(initData.messages)
            setRoom({ ...room, users: initData.users });
        })
        return () => {
            leaveRoom();
        }
    }, []);

    // listen to messages
    useEffect(() => {
        socket.on('message', (msg) => {
            setHistory([...history, msg])
        })
    });

    const leaveRoom = async () => {
        if (room.users.length <= 2) {
            socket.emit('disconnectRoom');
        }
        setRoom({ ...room, users: room.users.filter((user) => user.username !== userData.username) });
        setUserData({ ...userData, roomId: '' });
        socket.emit('disconnectUser', userData.username);
    }

    const handleLeaveRoom = (e) => {
        e.preventDefault();
        leaveRoom();
        // didn't tested this
        props.history.push('/user/dashboard');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let msg = {
            message,
            sender: userData,
        }
        socket.emit('message', msg)
        setMessage('');
    }
    const handleChange = (e) => {
        e.preventDefault();
        setMessage(e.target.value)
    }

    return(
        <div>
            {
                history.length === 0 ? <div>start conversation</div> : history.map(msg => 
                    <div>
                        {msg.message} - {msg.sender.username}
                    </div>
                )
            }
            <form onSubmit={handleSubmit}>
                <input onChange={handleChange} value={message}/>
                <button>submit</button>
            </form>
            <button value='leave' onClick={handleLeaveRoom} />
        </div>
    );
}

export default Room;