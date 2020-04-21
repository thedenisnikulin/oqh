import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

let socket;

const Room = (props) => {
    const userData = props.userData;
    
    return(
        <div>
            <Chat userData={userData}/>
        </div>
    );
};

const Chat = (props) => {
    const { userData } = props;
    const [ users, setUsers ] = useState([]);
    const [ message, setMessage ] = useState('');
    const [ history, setHistory ] = useState([]);

    useEffect(() => {
        socket = io.connect('http://localhost:8000');
        socket.emit('connectRoom', userData.roomId);
        socket.emit('init');
        socket.on('init', (initData) => {
            setHistory(initData.messages)
            setUsers(initData.users);
        })
        return () => {
            socket.emit('disconnect')  // room timer will disconnect the room
        }
    }, []);

    useEffect(() => {
        socket.on('message', (msg) => {
            setHistory([...history, msg])
        })
    });

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
        </div>
    );
}

export default Room;