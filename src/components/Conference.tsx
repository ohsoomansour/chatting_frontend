import { useRef } from 'react';
import { io } from 'socket.io-client';

//DOM elements.
//var srcObject: any;
const roomSelectionContainer = document.getElementById('room-selection-container');

const connectButton = document.getElementById('connect-button');
const videoChatContainer = document.getElementById('video-chat-container');
const localVideoComponent = document.getElementById('local-video');
const remoteVideoComponent = document.getElementById('remote-video');


const socket = io(); 
const mediaConstraints = {
  audio: true, 
  video: { width: 1280, height: 720}
}


let localStream;
let remoteStream;
let isRoomCreator;
let rtcPeerConnection;
let roomId;

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
  const joinRoomButton = (e: React.FormEvent) => {
    e.preventDefault();
    const roomInputValue = roomInputRef.current!.value;
    joinRoom(roomInputValue)
  };
  //
  const onrtcSocket = () => {  
    socket.on('room_created', async () => {
      console.log('Socket event callback: room_created');
      // await setLocalStream(mediaConstraints);
    })
    socket.on('room_joined', async () => {
      console.log('Socket event callback: room_joined');
      await setLocalStream(mediaConstraints);
    })
    socket.on('full_room', () => {
      console.log('Socket event callback: full_room');
      alert('The room is full, please please try another One!');
    })
  };
  
  function joinRoom (room:any) {
    if(room === '') {
      alert('Please type a room ID');
    } else {
      roomId = room;
      socket.emit('join', room);
      showVideoConference();
    }
  }
  
  function showVideoConference() {
    roomSelectionContainer?.setAttribute('style', '{display: "none"}' )
    videoChatContainer?.setAttribute('style', '{display:"block"}'  )
  } 

  async function setLocalStream(mediaConstraints: any) {
    let stream : MediaStream | undefined;
    
    try {
      // MediaStream을 검색
      stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    } catch (e){
      console.log('Could not get user media', e);
    }
    
    localStream = stream;
    localVideoComponent?.setAttribute('srcObject', `${stream}`) // ✔️media의 stream 값을 어떻게 전달 할 지 다시 고민!! 
  }


  return (
  <div>
    <div id="room-selection-container" className='centered' style={{display:"none"}}>
      <h1>{"WebRTC video conference"}</h1>
      <label>Enter the number of the room you want to connect</label>
      <form onSubmit={joinRoomButton}> 
        <input id='room-input' type='text' ref={roomInputRef}/>
        <button>roomId 제출</button>
      </form>
      <button id='connect-button'>{"CONNECT"}</button>
    </div>
    <div id="video-chat-container" className='video-position' style={{display:"block"}}>
      <video id="local-video" autoPlay loop muted width="100%" height="100%" ></video>
      <video id="remote-video" autoPlay loop muted width="100%" height="100%"></video>
    </div>
    <button onClick={onrtcSocket}>{"rtc 통신 시작!"}</button>
  </div>
  
  )
} 