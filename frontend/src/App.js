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
    const username = window.prompt('Qual o seu nome?');
    socket.emit('join', username);

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
    });

    socket.on('calling', (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  }, []);

  socket.on('disconnect', (userId) => {
    const { [userId]: valueOfUserId, ...withoutDisconnectedUser } = users;
    setUsers(withoutDisconnectedUser);
  });

  const callPeer = useCallback(
    (userToCallId) => {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream,
      });

      peer.on('signal', function startHandshake(signalData) {
        socket.emit('callUser', {
          signalData,
          from: yourID,
          userToCall: userToCallId,
        });
      });

      peer.on('stream', setPartnerVideo);

      socket.on('callAccepted', function finishHandshake(signalData) {
        setCallAccepted(true);
        peer.signal(signalData);
      });
    },
    [stream, yourID]
  );

  const acceptCall = useCallback(() => {
    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (signalData) => {
      socket.emit('acceptCall', { signal: signalData, to: caller });
    });

    peer.on('stream', setPartnerVideo);

    peer.signal(callerSignal);
  }, [caller, callerSignal, stream]);

  function setPartnerVideo(stream) {
    if (partnerVideo.current) partnerVideo.current.srcObject = stream;
  }

  return (
    <div className="container">
      {receivingCall && !callAccepted && (
        <div className="calling-backdrop">
          <div className="calling-modal">
            <strong>{users[caller]} está te ligando...</strong>
            <button onClick={acceptCall}>Aceitar</button>
          </div>
        </div>
      )}
      <div className="videos">
        <video ref={userVideo} autoPlay />
        <video ref={partnerVideo} autoPlay />
      </div>
      <div className="connected-users">
        {Object.keys(users).map((userId) => {
          if (userId === yourID) return null;

          return (
            <div className="connected-user" key={userId}>
              <strong>{users[userId]}</strong>
              <button onClick={() => callPeer(userId)}>Ligar</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
