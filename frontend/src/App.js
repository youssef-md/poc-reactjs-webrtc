import React, { useRef, useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';

import './App.css';

const socket = io.connect('http://localhost:8000');

function App() {
  const [yourID, setYourID] = useState('');
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

  const userVideo = useRef(null);
  const partnerVideo = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(function setUserStream(stream) {
        setStream(stream);
        if (userVideo.current) userVideo.current.srcObject = stream;
      });

    socket.on('yourID', (id) => {
      setYourID(id);
    });

    socket.on('allUsers', (users) => {
      setUsers(users);
      console.log(users);
    });

    socket.on('call', (data) => {});
  }, []);

  socket.on('disconnect', (userId) => {
    const { [userId]: valueOfUserId, ...withoutDisconnectedUser } = users;
    setUsers(withoutDisconnectedUser);
  });
  const callPeer = useCallback((id) => {});

  const acceptCall = useCallback(() => {});

  return (
    <div className="container">
      <div className="videos">
        <video ref={userVideo} autoPlay />
        <video ref={partnerVideo} autoPlay />
      </div>
      <div className="connected-users">
        {Object.keys(users).map((key) => {
          if (key === yourID) return null;

          return (
            <div className="connected-user" key={key}>
              <strong>{key}</strong>
              <button>Ligar</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
