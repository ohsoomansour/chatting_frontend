import { useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080', {transports:['websocket'], path:'/webrtc'})
//DOM elements.
//var srcObject: any;
const roomSelectionContainer = document.getElementById('room-selection-container');

//const connectButton = document.getElementById('connect-button');
const videoChatContainer = document.getElementById('video-chat-container');
const localVideoComponent = document.getElementById('local-video');
const remoteVideoComponent = document.getElementById('remote-video');

//연결
const mediaConstraints = {
  audio: true, 
  video: {width:{ideal:640}, height:{ideal:480}}
}
var localStream: MediaStream; 
let remoteStream;
let isRoomCreator: any;
let rtcPeerConnection: RTCPeerConnection;
let roomId: string;

const iceServers = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302'},
    { urls: 'stun:stun1.l.google.com:19302'},
    { urls: 'stun:stun2.l.google.com:19302'},
    { urls: 'stun:stun3.l.google.com:19302'},
    { urls: 'stun:stun4.l.google.com:19302'},
  ]
}

export default function Conference() {
  
  //const roomInput = document.getElementById('room-input');
  // 방 참가 버튼: roomInput의 input태그에서 값을 가져와야 된다.
  const roomInputRef = useRef<HTMLInputElement>(null);

  // ============================= function ===================================
  function joinRoom (room:string) {
    console.log(room);
    if(room === '') {
      alert('Please type a room ID');
    } else {
      roomId= room;
      socket.emit('join', roomId);
      showVideoConference();
    }
  }
  const joinRoomButton = (e: React.FormEvent) => {

    e.preventDefault();
    const roomInputValue:string = roomInputRef.current!.value;
    console.log("roomId:" + roomInputValue);
    joinRoom(roomInputValue);
  };
  //
  
  //✔️room_created가 되어야지 
  socket.on('room_created', async () => {
    console.log('Socket event callback: room_created');
    await setLocalStream(mediaConstraints);
    isRoomCreator = true;
  })
  socket.on('room_joined', async () => {
    console.log('Socket event callback: room_joined');
    await setLocalStream(mediaConstraints);
    socket.emit('start_call', roomId);
  })
  socket.on('full_room', async () => {
    console.log('Socket event callback: full_room');
    alert('The room is full, please please try another One!');
  })

  // #클라이언트의 media data를 가져오기 위해서 navigator.mediaDevices.getUserMedia 메서드를 호출
  //SOCKET EVENT CALLBACKS
  socket.on('start_call', async () => {
    //✔️현재 이 분기를 안탐 왜냐면 room created가 되어야지 isRoomCreator가 true가 된다. 
    if(isRoomCreator) {
      console.log("isroomcreator ture가")
      //#RTCPeerConnection이란? WebRTC 호출을 수행하여 비디오/오디오를 스트리밍하고 데이터를 교환하기 위한 API
      rtcPeerConnection = new RTCPeerConnection(iceServers); //✅구글의 STUN 서버들 사용하여 연결
      addLocalTracks(rtcPeerConnection) 
      //ontrack은 RTCPeeroConnection에 트랙이 등록 및 발생 -> 호출되는 함수를 지정함  
      rtcPeerConnection.ontrack = setRemoteStream;
      await createSDPOffer(rtcPeerConnection);      
    }
  })
  socket.on('webrtc_offer', async (webrtc_offer_event) => {
    console.log(`Socekt event callback: webrtc_offer ${webrtc_offer_event}`);
    if(!isRoomCreator) {
      rtcPeerConnection = new RTCPeerConnection(iceServers);
      
    }
  })
  /*
  const onrtcSocket = () => {  
  };   
  <button onClick={onrtcSocket}>{"rtc 통신 시작!"}</button>
  */

  /*
   * @Date : 2023.12.29
   * @Author : OSOOMAN
   * @Function : SDP Offer생성 
   * @Parm : RTCPeerConnection 
   * @Explain : SDP Offer 생성의 이해 및 설명      
      - Session Description Protocol의 약자
      - SDP는 단말 간의 멀티미디어 세션과 관련된 미디어 타입 및 포맷을 협상하는 프로토콜이며 '제안' 및 수락 (Offer & Answer) 모델로 동작
      - SDP는 NAT(Network Address Translators), IP주소, PORT 제한 처리 방법을 인식하지 못함 -> ✅rtcPeerConnection에서 STUN 서버를 사용하여 연결
      - 연결 후 socke.io 또는 WebSocket등을 통해 SDP와 candidate를 수신자에게 전달한다. 이것을 Signaling이라고 한다. 
        *Signaling 서버를 설정 및 제어만 담당, 라우팅 필요 없음
      */

    //작동 안함
  async function createSDPOffer(rtcPeerConnection:RTCPeerConnection) {
    console.log("createSDPOffer")
    let sessionDescription;
    try {
      sessionDescription = await rtcPeerConnection.createOffer();
      rtcPeerConnection.setLocalDescription(sessionDescription); //송신자, offer메세지를 localDescription에 등록
      socket.emit('webrtc_offer', {
        type: 'wetrtc_offer',
        sdp: sessionDescription,
        roomId,
      })
    } catch(error) {
      console.error(error);
    }
  }
  
  
  
  function showVideoConference() {
    roomSelectionContainer?.setAttribute('style', '{display: "none"}' )
    videoChatContainer?.setAttribute('style', '{display:"block"}'  )
  } 

  async function setLocalStream(mediaConstraints: any) {
    let streamObj;
    
    /* MediaStream 및 Track의 이해
      1. MediaStream: 오디오, 비디오 같은 미디어 스트림을 다루는 객체
      2. getTrancks 메서드의 이해: 
        The getTracks() method of the MediaStream interface returns a sequence that represents 
        ✔️'all the MediaStreamTrack objects' in this stream's track set
        *MediaStreamTrack: represents ✔️a single media track within a stream
    */
    try {
      // MediaStream 객체를 검색&반환:  사용자의 카메라와 마이크 같은 미디어 입력 장치에 접근
      streamObj = await navigator.mediaDevices.getUserMedia(mediaConstraints);

      localStream = streamObj;
      localVideoComponent?.setAttribute('srcObject', `${streamObj}`) // ✔️media의 stream 값을 어떻게 전달 할 지 다시 고민!! 
    } catch (e){
      //🚨 DOMException: Requested device not found
      console.error('Could not get user media', e);
    }
    
  }
  
  function addLocalTracks(rtcPeerConnection: RTCPeerConnection) {
    localStream?.getTracks().forEach((track) => {
  /*#addTracks
   addTrack() adds a new media track to the set of tracks which will be transmitted to the other peer.
   > track: 피어 연결에 추가될 미디어 트랙을 나타내는 '오디오'나 '비디오' :단일 미디어 트랙
   > ...streams:트랙이 추가되어야하는 하나 혹은 여러개의 로컬 'MediaStream 객체' 
   > MediaStream 안에 MediaStreamTrack이 있다. 그래서 이 trackd만 교체 해준다. 
   *track: 경주로
   > tcPeerConnection.addTrack:다른 유저에게 전송될 트랙들의 묶음에 신규 미디어트랙을 추가
  */  
      rtcPeerConnection.addTrack(track, localStream);
    })
  }
  function setRemoteStream(event: any) {
    remoteVideoComponent?.setAttribute('srcObject', event.streams[0])
  }

  return (
  <div>
    <div id="room-selection-container" className='centered' >
      <h1>WebRTC video Conference</h1>
      <label>Enter the number of the room you want to connect</label>
      <form onSubmit={joinRoomButton}> 
        <input id='room-input' type='text' ref={roomInputRef}/>
        <button>roomId 제출</button>
      </form>
    </div>
    <div id="video-chat-container" className='video-position' style={{display:"block"}}>
      <video id="local-video" autoPlay loop muted width="100%" height="100%" ></video>
      <video id="remote-video" autoPlay loop muted width="100%" height="100%"></video>
    </div>
    
  </div>
  
  )
} 