import React from "react";
import { useEffect, useRef, useState } from "react";
import { Chatting } from "../components/Chatting";
import { io } from "socket.io-client"
/* #1.React Hook의 이해 
    useEffect(func, [deps]) : 
    - mount 될 때, deps 값이 업데이트 될 때 useEffect는 실행
    - mount 될 때, 빈 배열이면 한 번 실행
    #2.Node.js 런타임 & useEffect의 이해를 통한 WebSocket 설정  
    - node는 자바스크립트 런타임에 document기능은 빠짐 
      따라서 WebSocket은 nodejs 빌드 할 때 에러를 발생시킨다. 
    - docs 마운트가 되고 실행시키는 것이 적합 
    

    #3. React.createContext : Context 객체
       > WebSocketContext 객체 
       > 
       context.Provider : 'ws' prop을 받아서 이 값을 하위에 있는 컴포넌트에게 전달 
    
    #4. useRef Hook 
      React를 사용하는 프로젝트에서도 가끔씩 DOM 을 직접 선택해야 하는 상황이 필요
      예시) 
      const 변수명 = useRef(초기값)
      <input ref= {변수명}/>
      이러한 결과값으로, {current:  초기값}  을 지닌 객체가 반환된다.
      특징1. 컴포넌트가 계속해서 렌더링이 되어도 컴포넌트가 언마운드되기 전까지는 값을 그대로 유지
      특징2. currnet 속성은 값을 변경해도 상태를 변경할 때 처럼 React 컴포넌트가 재렌더링 되지 않는다.
      특징3. 저장공간, ref는 state와 비슷하게 어떤 값을 저장하는 저장공간으로 사용된다.
      특징4. DOM요소에 접근
        useRef를 사용하면 손쉽게 input에 접근할 수 있다.
        바닐라 자바스크립트의 getElementById, querySelector와 비슷하다.
    #5. WebSocket 메세지 송/수신 
      <Chatting wsProp={ws} >{ws}</Chatting>
    
*/
                        

/* 해결1.
   12.26 Box 컴포넌트 만들고 속성을 통해서 data를 받아오는 부분 구현 해서 랜더링 
   
   *참조: https://itchallenger.tistory.com/581
   Any component props is by design an object, but you are defining it as an array.

   해결2. 소켓 설정
   > npm i socket.io-client
   > [package.json]  > 확인 > "socket.io-client": "^4.7.2",
*/
export default function WsTest() {
  //웹소켓
  const webSocketUrl = `ws://localhost:8080/chat`
  let [message, changeMessage] = useState("");
  let ws = useRef<WebSocket | null>(null);
;
  /*
  useEffect(() =>{
    
    if (!ws.current) {
      ws.current = new WebSocket(webSocketUrl);
      ws.current.onopen = () => {
        console.log("connected to " + webSocketUrl);
      }
      ws.current.onmessage = (event) => {
        console.log(event.data);
        changeMessage(event.data);
      }
      
      ws.current.onclose = error => {
        console.log("disconnect from " + webSocketUrl);
        console.log(error);
      };
      ws.current.onerror = error => {
        console.log("connection error " + webSocketUrl);
        console.log(error);
      };
    }
  }, [])
   */
  return (
    //Type '{ children: string; ws: MutableRefObject<WebSocket | null>; }' is not assignable to type 'IntrinsicAttributes & MutableRefObject<WebSocket>'.
    <div>
      <Chatting 
       wsProp={ws} 
       message={message}
      />
      
    </div>
  );
}