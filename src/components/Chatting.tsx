import React, { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
/* #1 TS 타입 문제 발생: 
   - 원인: "props vs parameter의 타입 비교 필요
   - 원리: ws = {current: 소켓 } > ws prop전달 > Chatting 컴포넌트에서는 파라미터인 wsProp = {wsProp : {current: 소켓}}   
   - 해결: 디스트럭쳐링 할당의 이해! {wsProp, message}:{wsProp:React.MutableRefObject<WebSocket | null> ,message:string}
  
   #2. 채팅 앱 UI 설계 : 시퀀스 다이어그램
   https://wikidocs.net/205997

   #3. never type
     - 절대 발생할 수 없는 타입: 그러니까 any 타입에도 할당하지 못함!
     - 함수 표현식이나 화살표 함수 표현식에서 항상 오류를 발생시키거나 절대 반환하지 않는 반환 타입

   에러                                           ✅any[]로 반환                       !=                        ✅never[]반환   "따라서 타입 지정 필요"
     Argument of type '(prevMessages: never[]) => any[]' is not assignable to parameter of type 'SetStateAction<never[]>'.
*/


//const socket = io('http://localhost:8080', {transports:['websocket'], path:'/webrtc'});



export const Chatting = ({sc}:{sc:Socket}) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userName, setUsername] = useState('');
  const [joinedUsers, setJoinedUsers] = useState<string[]>(['']);
  useEffect(() => {
  
    sc.on('message', (message) => {

      setMessages((prevMessages) => [...prevMessages, message]);
    });
   

    sc.on('userJoined', (userInfo) => {
      console.log(userInfo.userList);
      setJoinedUsers(userInfo.userList);
      
    })

    // 컴포넌트가 언마운트되면 소켓 연결 해제
    
    return () => {
      sc.disconnect();
    };
  }, []);
  
  const sendMessage = () => {
    if (inputMessage.trim() !== '') {
      // 서버로 메시지 전송
      sc.emit('message', inputMessage);

      // 메시지 입력 칸 비우기
      setInputMessage('');
    }
  };
  const setUName = () => {
    sc.emit('joinRoom', { userName: userName, roomId: 'room1'})
  }
  return (
    <div>
      <h1>Streaming</h1>
      <h3>방 참가 유저이름</h3>
      <div>
      
        {joinedUsers && joinedUsers!.map((user, index) => (
          <span key={index}>{user}님 </span>
        
        ))} 
      </div>
      <h3>대화 내용</h3>
      <div>
        { messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <div>
      닉네임:
      <input
        type="text"
        value={userName}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={setUName}>참가</button>
      message:
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}


/*
export const Chatting = ({wsProp, message}:{wsProp:React.MutableRefObject<WebSocket | null> ,message:string}) => {
  const handleClickSubmit = () => {
    socket.send(JSON.stringify({
      "event": "user2",
      "data": "Hell I'm User2"
    }))
  }
  

  return(
    <div>
      <div>user2:{message}</div>
      <button type="button" onClick={handleClickSubmit} >WebSocket message Send!</button>
    </div>
  )
}
*/

