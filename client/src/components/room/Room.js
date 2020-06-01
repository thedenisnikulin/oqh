import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

let socket;

const Room = (props) => {
    
    return(
        <div>
            <Chat userDataState={props.userDataState} roomState={props.roomState}/>
        </div>
    );
};

const Chat = (props) => {
    const { userData, setUserData } = props.userDataState;
    const { room, setRoom } = props.roomState;
    const [ message, setMessage ] = useState('');
    const [ history, setHistory ] = useState([
        {
            message: 'hello',
            sender: {
                id: "bluh",
                username: "test1",
                bio: "heeeeey",
                roomId: 'this'
            }
        },
        {
            message: 'hey there',
            sender: {
                id: "bluh",
                username: "test2",
                bio: "heeeeey",
                roomId: 'this'
            }
        },
        {
            message: 'fuck you all',
            sender: {
                id: "bluh",
                username: "me",
                bio: "yeh",
                roomId: 'this'
              }
        }
    ]);
    const [ isUserLeaving, setIsUserLeaving ] = useState(false);

    // initialize data on mount
    useEffect(() => {
        socket = io.connect('http://localhost:7000');
        console.log(userData)
        socket.emit('connectRoom', userData.roomId);
        socket.emit('init');
        socket.on('init', (initData) => {
            setHistory(initData.messages);
        });
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

    // listen to "leave" event
    useEffect(() => {
        isUserLeaving && leaveRoom();
    }, [isUserLeaving])


    const leaveRoom = () => {
        // clean up room if no users in the room
        if (room.users.length <= 2) {
            socket.emit('disconnectRoom');
        }
        let arr = room.users;
        console.log('we are leaving')
        arr = room.users.filter((user) => user.username !== userData.username);
        arr = arr.map(u => { u.isRated = false; return u });
        setRoom({ ...room, id: '', users: arr, isReady: false });
        setUserData({ ...userData, roomId: '' });
        socket.emit('disconnectUser', userData.username);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let msg = {
            message,
            sender: userData,
        };
        socket.emit('message', msg);
        setMessage('');
    }
    const handleChange = (e) => {
        e.preventDefault();
        setMessage(e.target.value);
    };

    return(
        <div className="background-main">
            <div className="main-container">
                <div className="room-members">
                    <div className="title">
                        <div className="tite-text">{room.topic}</div>
                        <button onClick={() => setIsUserLeaving(true)}>:</button>
                    </div>
                    {
                        room.users.map(user => (
                            <div className="member">
                                <div className="member-pic"></div>
                                <div className="member-username">@{user.username}</div>
                            </div>
                        ))
                    }
                </div>
                <div className="messenger">
                    <ul >
                        {
                            history.length === 0 ? <div className="empty-msgs">Say something, e.g. "Hi"</div> : history.map(msg => 
                                <li className={msg.sender.username === userData.username ? "msg-me" : "msg-not-me"}>
                                    {msg.sender.username !== userData.username && <div className="msg-sender-username">{"@" + msg.sender.username !== userData.username && msg.sender.username}</div>}
                                    <div className="message-text">{msg.message}</div>
                                </li>
                            )
                        }
                    </ul>
                    
                    <form className="msg-form" onSubmit={handleSubmit}>
                        <input placeholder="type here" className="msg-input" onChange={handleChange} value={message}/>
                        <button className="msg-send">></button>
                    </form>
                    { isUserLeaving && <RateUsers userData={userData} roomState={ props.roomState } /> }
                </div>
            </div>
        </div>
    );
}

const RateUsers = (props) => {
    const userData = props.userData;
    const { room, setRoom } = props.roomState;
    const [ feedbackCount, setFeedbackCount ] = useState(0);
    const [ isRedirect, setIsRedirect ] = useState(false);

    const handleClick = async (valueToAdd, user) => {
        setFeedbackCount(feedbackCount + 1);
        let arr = room.users;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].username === user.username) {
                arr[i].isRated = true;
                break;
            };
        };
        setRoom({ ...room, users: arr });
        await axios.post('http://localhost:7000/room/add-rep', {
            valueToAdd: valueToAdd,
            username: user.username,
        });
    };

    return(
        <div>
            {
                room.users.map(user =>
                    <div>
                        <div>
                            { user.username }
                        </div>
                        {
                            !user.isRated ? <div>
                                <button onClick={ () => handleClick(1, user) }>up</button>
                                <button onClick={ () => handleClick(-1, user) }>down</button>
                            </div> : <div>rated</div>
                        }
                    </div>
                )
            }
            { feedbackCount === 3 && <input type='button' value='go back' onClick={ () => setIsRedirect(true) } /> }
            { isRedirect && <Redirect to="/dashboard" /> }
        </div>
    );
}

export default Room;