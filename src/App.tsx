import { useEffect } from 'react';
import WsTest from './websockets/wsTest';
import { io } from 'socket.io-client';



let interval = 8000;
export default function App() {
  const onSocket = () => {  
    
    const socket = io('http://localhost:8080', {transports:['websocket'], path:'/chat' });

    socket.emit('user1', '클라이언트에서 서버로 보냄');
    setInterval(() => {
    }, interval);
    
    socket.on('hi', (data) => console.log(data)); // 서버 -> 클라이언트
    
  };
  return (
    <div className="App">
      <WsTest />
      <button onClick={onSocket}> socket 통신 시작</button>
    </div>
  );
}

