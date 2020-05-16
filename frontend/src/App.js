import React, {
  useRef,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';

import './App.css';

function App() {
  const [yourID, setYourID] = useState('');
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();

  useEffect(() => {
    socket.current = io.connect('http://localhost:8000');

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(function setUserStream(stream) {
        setStream(stream);
        if (userVideo.current) userVideo.current.srcObject = stream;
      });

    socket.current.on('yourID', (id) => {
      console.log(id);
      setYourID(id);
    });

    socket.current.on('allUsers', (users) => {
      console.log(users);

      setUsers(users);
    });
    socket.current.on('call', (data) => {});
  }, []);

  const callPeer = useCallback((id) => {});

  const acceptCall = useCallback(() => {});

  return (
    <div className="container">
      <div className="videos">
        <video ref={userVideo} autoPlay />
        <video ref={partnerVideo} autoPlay />
      </div>
      <div className="buttons">
        <button>Ligar</button>
        <button>Aceitar</button>
      </div>
    </div>
  );
}

export default App;
