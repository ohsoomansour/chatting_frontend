import React from 'react';

/* #1 TS 타입 문제 발생: 
   - 원인: "props vs parameter의 타입 비교 필요
   - 원리: ws = {current: 소켓 } > ws prop전달 > Chatting 컴포넌트에서는 파라미터인 wsProp = {wsProp : {current: 소켓}}   
   - 해결: 디스트럭쳐링 할당의 이해! {wsProp, message}:{wsProp:React.MutableRefObject<WebSocket | null> ,message:string}
  
   #2. 채팅 앱 UI 설계 : 시퀀스 다이어그램
   https://wikidocs.net/205997
*/
export const Chatting = ({wsProp, message}:{wsProp:React.MutableRefObject<WebSocket | null> ,message:string}) => {
  
  const handleClickSubmit = () => {
    wsProp.current?.send(JSON.stringify({
      "event": "user2",
      "data": "Hell I'm User2"
    }))
  }
  

  return(
    <div>
      <div>user2:{message}</div>
      <button type="button" onClick={handleClickSubmit}>WebSocket message Send!</button>
    </div>
  )
}
