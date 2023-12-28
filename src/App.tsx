import { useEffect } from 'react';
import WsTest from './websockets/wsTest';
import { io } from 'socket.io-client';
import Conference from './components/conference';



export default function App() {
  const onSocket = () => {  
    new RTCPeerConnection()
    const socket = io('http://localhost:8080', {transports:['websocket'], path:'/chat' });
    const socket2 = io('http://localhost:8081', {transports:['websocket'], path:'/webrtc'})
    socket.emit('user1', '클라이언트에서 서버로 보냄');
    
    socket2.emit('rtc1', '니가 서버 이라면서? ');

    // Signalling Server, rtc1이벤트 서버 -> 클라이언트
    socket2.on('client_rtc1', (data) => console.log(data));  
    
  };
  return (
    <div className="App">
      <WsTest />
      <Conference />
      <button onClick={onSocket}> socket 통신 시작</button>
    </div>
  );
}

