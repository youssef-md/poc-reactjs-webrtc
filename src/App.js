import React, { useRef, useCallback, useEffect } from 'react';
import './App.css';

function App() {
  const videoRef = useRef();
  const remoteRef = useRef();

  const onSuccess = useCallback((stream) => {
    videoRef.current.srcObject = stream;
  }, []);

  const onFailure = useCallback(() => {
    alert('Aceite o acesso a camera!');
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(onSuccess)
      .catch(onFailure);
  }, [onFailure, onSuccess]);

  return (
    <div className="container">
      <div className="videos">
        <video ref={videoRef} autoPlay />
        <video ref={remoteRef} autoPlay />
      </div>
      <div className="buttons">
        <button>Ligar</button>
        <button>Aceitar</button>
      </div>
    </div>
  );
}

export default App;
