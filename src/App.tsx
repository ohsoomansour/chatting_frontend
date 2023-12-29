import { io } from 'socket.io-client';
import Conference from './components/Conference';




export default function App() {
  /*
  const onSocket = () => {  

    const socket = io('http://localhost:8080', {transports:['websocket'], path:'/chat' });
    //const socket2 = io('http://localhost:8080', {transports:['websocket'], path:'/webrtc'})
    socket.emit('join', '클라이언트에서 서버로 보냄');
    <button onClick={onSocket}> socket 통신 시작</button>
  };
*/
  return (
    <div className="App">
      <Conference />

    </div>
  );
}

