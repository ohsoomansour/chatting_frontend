import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080', {transports:['websocket'], path:'/webrtc'})

//DOM elements.
//var srcObject: any;
const roomSelectionContainer = document.getElementById('room-selection-container');
const videoChatContainer = document.getElementById('video-chat-container');
const remoteVideoComponent = document.getElementById('remote-video');

//연결
const mediaConstraints = {
  audio: true, 
  video: {width:1280, height:720} 
}
let localStream: MediaStream; 
let remoteStream: MediaStream;

let isRoomCreator: boolean;
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const roomInputRef = useRef<HTMLInputElement>(null);

  // ============================= function ===================================
  function joinRoom (room:string) {
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
    joinRoom(roomInputValue);
  };

  
  socket.on('room_created', async () => {
    console.log('Socket event callback: room_created');
    await setLocalStream(mediaConstraints);
    isRoomCreator = true; //나 방장
    
  })
  socket.on('room_joined', async () => {
    
    console.log('Socket event callback: room_joined');
    await setLocalStream(mediaConstraints); //미디어 객체 얻어가지고  콜시작하자!
    socket.emit('start_call', roomId); 
  })
  socket.on('full_room', async () => {
    console.log('Socket event callback: full_room');
    alert('The room is full, please please try another One!');
  })

  // #클라이언트의 media data를 가져오기 위해서 navigator.mediaDevices.getUserMedia 메서드를 호출
  
  socket.on('start_call', async () => {
    console.log("start_call 들어옴")
    //✔️현재 이 분기를 안탐 왜냐면 room created가 되어야지 isRoomCreator가 true가 된다. 
    if(isRoomCreator) {
    /*#RTCPeerConnection이란? 
      - WebRTC 호출을 수행하여 비디오/오디오를 스트리밍하고 데이터를 교환하기 위한 API
      - STUN 서버를 통해 자신의 'Public Address'를 알아낸다
    */  
    rtcPeerConnection = new RTCPeerConnection(iceServers); //✅구글의 STUN 서버들 사용하여 연결
      addLocalTracks(rtcPeerConnection) 
      /*# rtcPeerConnection.onicecandidate
      - offer 또는 answer를 보냈던 상대방에게 '본인의 icecandidate 정보'를 Signaling Server를 통해 보낸다. 
      - 데이터 교환을 할 대상의 EndPoint 정보라고 생각 -> iceCandidate 대상이 생기면 sendIceCandidate가 실행
      #ontrack: 상대방의 RTCSessionDescription을 본인의 RTCPeerConnection에서의 remoteSessionDescription으로 지정하면 
      '상대방의 track 데이터에 대한 이벤트'가 발생
       
      */
      rtcPeerConnection.ontrack = setRemoteStream;
      rtcPeerConnection.onicecandidate = sendIceCandidate;
    //✅자신의 SessionDescription을 생성 + Signaling Server를 통해 상대방 peer에게 전달!
      await createSDPOffer(rtcPeerConnection);      
    }
  })
  
  socket.on('webrtc_offer', async (webrtc_offer_event) => {
    isRoomCreator = false;
    console.log(`Socekt event callback: webrtc_offer ${webrtc_offer_event}`);
    
    /*#console.log(webrtc_offer_event)
      roomId: "5"
      sdp: {type: 'offer', sdp: 'v=0\r\no=- 7646319231209757540 2 IN IP4 127.0.0.1\r\ns…f90e898684 787b5738-17e8-4765-8397-e8d8d4607986\r\n'}
      type: "wetrtc_offer"
    */
    //test isRoomCreator = false; 
    if(!isRoomCreator) {
      //자신의 Public Address를 알아내고 === 공인 ip와 port를 찾아줌
      rtcPeerConnection = new RTCPeerConnection(iceServers);
      addLocalTracks(rtcPeerConnection);
      rtcPeerConnection.onicecandidate = sendIceCandidate;
      //#연결을 성립
      const {roomId, ...webrtc_offer_eventWithoutRoomId} = webrtc_offer_event;
      rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(webrtc_offer_eventWithoutRoomId))
      await createSDPAnswer(rtcPeerConnection);
    }
  })
   // test1. loalhost:3000 vs localhost 3001 서로 다른 소켓을 이용해서 answer의 답변을 받을 수 있는 지
  socket.on('webrtc_answer', async (event) => {
    console.log('Socekt event callback: webrtc_answer')
    /*#console.log(event)
      candidate: "candidate:2147081676 1 udp 2122260223 192.168.200.131 58366 typ host generation 0 ufrag oa6C network-id 1 network-cost 10"
      label: 0
      roomId: "5"
    */
    //문제, https://stackoverflow.com/questions/71772256/answer-sdp-error-kurento-nodejs-server-with-vanilla-webrtc-client
      rtcPeerConnection = new RTCPeerConnection(iceServers);
      addLocalTracks(rtcPeerConnection);
      rtcPeerConnection.onicecandidate = sendIceCandidate;
      /*TypeError: Failed to construct 'RTCSessionDescription': 
      Failed to read the 'type' property from 'RTCSessionDescriptionInit':
      The provided value 'wetrtc_offer' is not a valid enum value of type RTCSdpType.
      Failed to construct 'RTCIceCandidate': sdpMid and sdpMLineIndex are both null.
      */
      const {roomId, ...eventWithoutRoomId} = event;
      rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(eventWithoutRoomId))
      await createSDPAnswer(rtcPeerConnection);
      rtcPeerConnection.ontrack = setRemoteStream;
  })

  socket.on('webrtc_ice_candidate', (event) => {
    console.log('Socket event callback: webrtc_ice_candidate');
    console.log(event);
    var candidate = new RTCIceCandidate({
      sdpMLineIndex: event.label,
      candidate: event.candidate,
    });
    /*🚨 Failed to execute 'addIceCandidate' on 'RTCPeerConnection': The remote description was null
    이때 만약 Remote Description이 없으면 정보가 삽입될 곳이 없으니 예외가 발생하고 해당 ICECandidate는 누락
     > 참조: https://velog.io/@njw1204/WebRTC-%EA%B0%84%ED%97%90%EC%A0%81-%EC%97%B0%EA%B2%B0-%EC%8B%A4%ED%8C%A8-%EB%AC%B8%EC%A0%9C-%ED%95%B4%EA%B2%B0
    */
    rtcPeerConnection.addIceCandidate(candidate);

  })
  

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

    
  async function createSDPOffer(rtcPeerConnection:RTCPeerConnection) {
    console.log("createSDPOffer")
    let sessionDescription;
    try {
      sessionDescription = await rtcPeerConnection.createOffer(); // 세션 디스크립션 생성
      rtcPeerConnection.setLocalDescription(sessionDescription); //송신자, offer메세지를 localDescription에 등록
      socket.emit('webrtc_offer', {
        roomId,
        type: 'wetrtc_offer',
        sdp: sessionDescription,
      })
    } catch(error) {
      console.error(error);
    }
  }
  async function createSDPAnswer(rtcPeerConnection: RTCPeerConnection) {
    let sessionDescription;
    try {
      sessionDescription = await rtcPeerConnection.createAnswer(); 
      rtcPeerConnection.setLocalDescription(sessionDescription);
      socket.emit('webrtc_answer', {
        roomId,
        type: 'wetrtc_answer',
        sdp: sessionDescription,
      })
    } catch(e) {
      console.error(e);
    }
  }


  function sendIceCandidate(event:any) {
    if (event.candidate) {
        socket.emit('webrtc_ice_candidate', {
          roomId,
          label: event.candidate.sdpMLineIndex,
          candidate: event.candidate.candidate
        })
    } else {
      // All ICE candidates have been sent
    }
  }

  function showVideoConference() {
    roomSelectionContainer?.setAttribute('style', '{display:"block"}')
    videoChatContainer?.setAttribute('style', '{display:"block"}'  )
  } 

  async function setLocalStream(mediaConstraints: any) {
    let streamObj : MediaStream
    
    /* MediaStream 및 Track의 이해
      1. MediaStream: 오디오, 비디오 같은 미디어 스트림을 다루는 객체
      2. getTrancks 메서드의 이해: 
        The getTracks() method of the MediaStream interface returns a sequence that represents 
        ✔️'all the MediaStreamTrack objects' in this stream's track set
        *MediaStreamTrack: represents ✔️a single media track within a stream
    */
    try {
      /* MediaStream 객체를 검색&반환:  사용자의 카메라와 마이크 같은 미디어 입력 장치에 접근
         active: true
         id: "883c91ad-9bc6-41cb-8e58-0a072399bc93"
         onactive: null
         onaddtrack: null
         oninactive:  null
         onremovetrack: null
      */
      streamObj = await navigator.mediaDevices.getUserMedia(mediaConstraints);
      console.log("getUserMedia의 결과는 아래")
      console.log(streamObj);
    } catch (e){
      /*🚨 DOMException: Requested device not found
      > 일단 장치 접근 권한 확인: 카메라 및 video 접권 허용으로 변경 필요
      *실행: ms-settings:privacy-webcam > 접근 허용 전체조사 
      > 여러 브라우저에서 같은 localhost:3001에서 같은 메서드를 사용하고 있을 경우가 있다. 
      > 브라우저의 캐시 전부 삭제! 
      > 컴퓨터 재부팅 후 cmd 관리자 권한으로 port 찾아내서 taskkill
      > media 정상 실행 확인 방법: chrome 기준, 탭창에 빨간색 원으로 실행되고 있다는 표시가 뜸 
      */
     console.error('Could not get user media', e);
    }
    
    localStream = streamObj!
    
    videoRef!.current!.srcObject = localStream;
    //localVideoComponent?.setAttribute('srcObject', localStream) // ✔️media의 stream 값을 어떻게 전달 할 지 다시 고민!! 
    
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
  // 상대방의 트랙에 대한 event 발생: t
  function setRemoteStream(event: RTCTrackEvent) {
    console.log("setRemoteStream의 매개변수 event:(아래)")
    console.log(event)
    remoteVideoRef!.current!.srcObject = event.streams[0];
    remoteStream = event.streams[0];
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
      <video id="local-video" autoPlay loop muted width="100%" height="100%" ref={videoRef}></video>
      <video id="remote-video" autoPlay loop muted width="100%" height="100%" ref={remoteVideoRef}></video>
    </div>
    
  </div>
  
  )
} 

