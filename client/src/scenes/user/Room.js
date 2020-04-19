import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:8000')

const Room = (props) => {
    const userData = props.userData;
    const room = props.userData.room;
    
    return(
        <div>
            <Chat userData={userData} room={room}/>
        </div>
    );
};

const Chat = (props) => {
    const { userData } = props;
    const [ users, setUsers ] = useState([]);
    const [ message, setMessage ] = useState('');
    const [ history, setHistory ] = useState([]);

    useEffect(() => {
        axios.post('http://localhost:7000/user/room', { roomId: userData.roomId })
            .then(result => {
                // this shit gets unsorted messages
                result.data.messages.map(msg => {
                    history.push(msg);
                });
                console.log(result.data.users);
                setUsers(result.data.users);
            })
        socket.on('connect');
        socket.emit('init', { userData: userData, room: userData.roomId });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        let msg = {
            message,
            sender: userData,
        }
        socket.emit('message', msg)
        setHistory([ ...history, msg ])
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
        </div>
    );
}

export default Room;