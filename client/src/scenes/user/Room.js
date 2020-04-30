import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
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
    const [ isUserLeaving, setIsUserLeaving ] = useState(false);

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

    useEffect(() => {
        leaveRoom();
    }, [isUserLeaving])

    const leaveRoom = async () => {
        if (room.users.length <= 2) {
            socket.emit('disconnectRoom');
        }
        setRoom({ ...room, users: room.users.filter((user) => user.username !== userData.username) });
        setUserData({ ...userData, roomId: '' });
        socket.emit('disconnectUser', userData.username);
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
            <button value='leave' onClick={() => setIsUserLeaving(true)} />
            { isUserLeaving && <UsersFeedback roomState={ props.roomState } /> }
        </div>
    );
}

const UsersFeedback = (props) => {
    const { room, setRoom } = props.roomState;
    const [ feedbackCount, setFeedbackCount ] = useState(0);
    const [ isRedirect, setIsRedirect ] = useState(false);

    const handleClick = (valueToAdd, user) => {
        axios.post('http://localhost:7000/user/room', {
            valueToAdd: valueToAdd,
            user: user,
        }).then(() => {
            setFeedbackCount(feedbackCount+1);
        })
    }

    return(
        <div>
            {
                room.users.map(user =>
                    <div>
                        <div>
                            { user.username }
                        </div>
                        <div>
                            <button onClick={ () => handleClick(1, user) }>up</button>
                            <button onClick={ () => handleClick(-1, user) }>down</button>
                        </div>
                    </div>
                )
            }
            { feedbackCount === 4 && <input type='button' value='go back' onClick={ () => setIsRedirect(true) } /> }
            { isRedirect && <Redirect to="user/dashboard" /> }
        </div>
    );
}

export default Room;