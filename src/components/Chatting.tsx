
/* 문제해결1.
   - 원리: ws = {current: 소켓 } > ws prop전달 > Chatting 컴포넌트에서는 파라미터인 wsProp = {wsProp : {current: 소켓}}
   디스트럭쳐링 할당 
   
  #onmessage 메서드 사용법: 
   - onmessage 이벤트가 발생하면(즉, 웹소켓을 통해 메시지를 수신하면)
*/
import React, { MutableRefObject, useEffect, useState } from 'react'

//
export const Chatting = ({wsProp, message}:{wsProp:React.MutableRefObject<WebSocket | null> ,message:string}) => {
  console.log(message);
  /**/
  const handleClickSubmit = () => {
    wsProp.current?.send(JSON.stringify({
      "event": "user2",
      "data": "Hell I'm User2"
    }))
  }
  //wsProp.current?.onmessage = () => {}
  
  
  return(
    <div>
      <div>user2:{message}</div>
      <button type="button" onClick={handleClickSubmit}>Send!</button>
    </div>
  )
}
