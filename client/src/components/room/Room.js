import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import ControlledExpansionPanel from "./ExpansionPanel"
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ModalOnLeave from './ModalOnLeave';

let socket;

const Room = (props) => {
    
    return(
        <div>
            <Chat userDataState={props.userDataState} roomState={props.roomState}/>
        </div>
    );
};

const Chat = (props) => {
    const [open, setOpen] = useState(false);

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
            message: 'fuck you all fuck you allfuck you allfuck you allfuck you allfuck you allfuck you allfuck you allfuck you allfuck you allfuck you allfuck you all',
            sender: {
                id: "bluh",
                username: "me",
                bio: "yeh",
                roomId: 'this'
              }
        },
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
                        <IconButton color="primary" style={{color: "white"}} onClick={() => {setIsUserLeaving(true); setOpen(true)}}>
                            <NavigateBeforeIcon />
                        </IconButton>
                        <ModalOnLeave openModalState={{open, setOpen}} userData={userData} roomState={ props.roomState } />
                        <div className="title-text">#{room.topic}</div>
                    </div>
                    <div className="members-container">
                        {
                            room.users.map(user => (
                                <ControlledExpansionPanel user={user} />
                            ))
                        }
                    </div>
                    
                </div>
                <div className="messenger">
                    <div className="messages">
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
                    </div>
                    <form className="msg-form" onSubmit={handleSubmit}>
                        <input placeholder="type here" className="msg-input" onChange={handleChange} value={message}/>
                        <button className="msg-send">></button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export const RateUsers = (props) => {
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
        <div className="rate-users-container">
            <div className="rate-title">How do you like these guys?</div>
            <div className="rating">
                {
                    room.users.map(user =>
                        <div className="user-to-rate">
                            <div className="user-data-rate">
                                <div className="member-pic"></div>
                                <div className="member-username">
                                    @{ user.username }
                                </div>
                            </div>
                            {
                                !user.isRated ? <div className="rate-buttons-container">
                                    <IconButton color="primary" style={{color: "#74D69D"}} onClick={ () => handleClick(1, user) }>
                                        <ExpandLessIcon />
                                    </IconButton>
                                    <IconButton color="primary" style={{color: "#FF8383"}} onClick={ () => handleClick(-1, user) }>
                                        <ExpandMoreIcon />
                                    </IconButton>
                                </div> : <div style={{marginRight: "2rem"}}>rated</div>
                            }
                        </div>
                    )
                }
                { isRedirect && <Redirect to="/dashboard" /> }
            </div>
            { 
                feedbackCount === 3 && 
                    <input type='button' value='go back' onClick={ () => setIsRedirect(true) } /> 
            }
        </div>
        
    );
}

export default Room;