import { useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import styled from 'styled-components';
import {  useRecoilValue, useSetRecoilState } from 'recoil';
import { isDarkAtom } from '../recoil/atom_Theme';
import ReactPlayer from "react-player";
import { userIdState } from '../recoil/atom_user';
import React, { useCallback } from 'react';
import {useDropzone} from 'react-dropzone'

const StreamingWrapper=styled.div`
  background-color: ${(props) => props.theme.bgColor};
`;
//border: ${(props) => `4px solid ${props.theme.accentColor}`};
const ChatContent=styled.div`
  color:${(props) => props.theme.textColor};
  background-color: whitesmoke;
`;
export const UI = styled.div`
  display:flex;
  flex-direction: column;
`;
const ChatContainer = styled.div``;
export const RplayerWrapper = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  .player {
    border-radius: 20px;
    overflow: hidden;
    margin-top:10px;
  }
`;

const LoadingSvg = styled.svg`
  fill: #7e79ad;
  position: fixed;
  top: 50%;
  left: 50%;
`;
interface ImsgObj{
  msg:string;
  url:string;
  time:string;
}

interface IProps {
  msg:string;
  url:string;
  time: string;
}
//DOM elements.
//var srcObject: any;
const roomSelectionContainer = document.getElementById('room-selection-container');
const videoChatContainer = document.getElementById('video-chat-container');
//연결
const mediaConstraints = {
  audio: true, 
  video: {width:1280, height:720} 
}
let localStream: MediaStream; 
let remoteStream: MediaStream; 


let isRoomCreator: boolean; 
let rtcPeerConnection: RTCPeerConnection;

var roomId: string;

const iceServers = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302'},
    { urls: 'stun:stun1.l.google.com:19302'},
    { urls: 'stun:stun2.l.google.com:19302'},
    { urls: 'stun:stun3.l.google.com:19302'},
    { urls: 'stun:stun4.l.google.com:19302'},
  ]
}



export default function Streaming() {
  
  const userId = useRecoilValue(userIdState);
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const roomInputRef = useRef<HTMLInputElement>(null);
  const [sc, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<IProps[]>([{msg:'', url: '', time: ''}]);
  const [inputMessage, setInputMessage] = useState('');
  const [joinedUserList, setJoinedUserList] = useState<string[]>(['']);
  const [particapants, setParticapants] = useState<string[]>([''])
  const [DraggedFile, setDragFile] = useState([])
  const [isLoading, setLoading] = useState(false);


  useEffect(() => {
    let sc = io('http://localhost:8080', {transports:['websocket'], path:'/webrtc'}) 
    setSocket(sc)
    sc.on('room_created', async () => {
      console.log('Socket event callback: room_created');
      await setLocalStream(mediaConstraints);
      
      isRoomCreator = true; //나 방장
    })

    sc.on('room_joined', async () => {
        
      console.log('Socket event callback: room_joined');
      await setLocalStream(mediaConstraints); //미디어 객체 얻어가지고  콜시작하자!
      
      sc.emit('start_call', roomId); 
    })
    //
    sc.on('full_room', async () => {
      console.log('Socket event callback: full_room');
      alert('The room is full, please please try another One!');
    })

    // #클라이언트의 media data를 가져오기 위해서 navigator.mediaDevices.getUserMedia 메서드를 호출
    
    sc.on('start_call', async () => {
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
        rtcPeerConnection.ontrack = (ev) => {
          if (remoteVideoRef.current) {
            
            remoteVideoRef.current.srcObject = ev.streams[0];     
          }
        }
        //setRemoteStream;



        rtcPeerConnection.onicecandidate = sendIceCandidate;  
      //✅자신의 SessionDescription을 생성 + Signaling Server를 통해 상대방 peer에게 전달!
        await createSDPOffer(rtcPeerConnection);      
      }
    })
    
    sc.on('webrtc_offer', async (webrtc_offer_event) => {
      console.log(`Socekt event callback: webrtc_offer ${webrtc_offer_event}`);
  
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
     
    sc.on('webrtc_answer', async (answerSDPEvent) => {
      console.log('Socekt event callback: webrtc_answer')
      console.log(answerSDPEvent);
      //Failed to execute 'addTrack' on 'RTCPeerConnection': A sender already exists for the track.
      
      rtcPeerConnection = new RTCPeerConnection(iceServers);
      addLocalTracks(rtcPeerConnection);
      rtcPeerConnection.ontrack = (ev) => {
        if (remoteVideoRef.current) {
          remoteStream = new MediaStream([ev.track]);
          console.log("setEvent발생 위:")
          console.log(remoteStream)
          remoteVideoRef.current!.srcObject = ev.streams[0];
          //Or create your own remote streams to put your tracks in any wa
          //remoteVideoRef.current!.srcObject = new MediaStream([ev.track]);
        }
      }

        //#연결 성립
        rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(answerSDPEvent)) //가정: answer 
        //#상대박의 트랙이 변동 발생 시 이벤트 헨들러 동작 방식 설정
        //await createSDPAnswer(rtcPeerConnection);

    })
  
    sc.on('webrtc_ice_candidate', (event) => {
      console.log('Socket event callback: webrtc_ice_candidate');

      var candidate = new RTCIceCandidate({
        sdpMLineIndex: event.label,
        candidate: event.candidate,
      });
      /*🚨 Failed to execute 'addIceCandidate' on 'RTCPeerConnection': The remote description was null
      이때 만약 Remote Description이 없으면 정보가 삽입될 곳이 없으니 예외가 발생하고 해당 ICECandidate는 누락
       > 참조: https://velog.io/@njw1204/WebRTC-%EA%B0%84%ED%97%90%EC%A0%81-%EC%97%B0%EA%B2%B0-%EC%8B%A4%ED%8C%A8-%EB%AC%B8%EC%A0%9C-%ED%95%B4%EA%B2%B0
      */
      
       //rtcPeerConnection.addIceCandidate(candidate);
      if (rtcPeerConnection.remoteDescription) {
         // addIceCandidate 호출
         rtcPeerConnection.addIceCandidate(candidate)
          .then(() => {
            // 성공적으로 ICE candidate가 추가된 경우의 처리
            console.log("성공적으로 ICE candidate가 추가 되었습니다.")
          })
          .catch(error => console.error("ICE candidate 추가 중 오류:", error));
      } else {
        console.warn("remoteDescription이 설정되지 않았습니다.");
      } 


    })
    
   //================================================ Chatting ===============================================
   sc.on('message', (msgObj:ImsgObj) => {
    console.log('msgObj:')
    console.log(msgObj)
    setMessages((prev) => [...prev, msgObj]); 
    setLoading(isLoading)
  });
 

    sc.on('userJoined', (userInfo) => {
      console.log('userJoin 이벤트의 userInfo.userList:')
      console.log(userInfo.userList);
      setJoinedUserList(userInfo.userList);
    })
    sc.on('participants', (p) => {
      setParticapants(p.participant);
    })

    /*#컴포넌트가 언마운트될 때 웹 소켓연결을 닫음
    1.dependency가 바뀌어서 effect가 달라져야 할 때 (이전 effect 청소)
    2.해당 component가 unmount 될 때
    */
    return () => {
      sc.disconnect();
    };
  
  }, [])
  // ====================================== Conference function ===================================
  function joinRoom (room:string) {
    if(room === '') {
      alert('Please type a room ID');
    } else {
      roomId= room;
      sc!.emit('join', roomId);
      showVideoConference();
    }
  }
  const joinRoomButton = (e: React.FormEvent) => {

    e.preventDefault();
    const roomInputValue:string = roomInputRef.current!.value;
    joinRoom(roomInputValue);
  };
  
  function setRemoteStream(event: RTCTrackEvent) {
    console.log("setRemoteStream의 매개변수 event:(아래)")
    console.log(event.streams[0])
    remoteStream = event.streams[0]; 
    remoteVideoRef.current!.srcObject = remoteStream;  
  }
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
      sessionDescription = await rtcPeerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      })

//🌟You're trying to process an SDP answer when you haven't generated an offer or have already processed an answer.
      await rtcPeerConnection.setLocalDescription(sessionDescription);  //offer
      
      //송신자, offer메세지를 localDescription에 등록
      sc!.emit('webrtc_offer', {
        roomId,
        type: 'webtrtc_offer',
        sdp: sessionDescription,
      })
    } catch(error) {
      console.error(error);
    }
  }
  async function createSDPAnswer(rtcPeerConnection: RTCPeerConnection) {
    let sessionDescription;
    try {
      sessionDescription = await rtcPeerConnection.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
        
      });
      await rtcPeerConnection.setLocalDescription(sessionDescription);  //answer 
      sc!.emit('webrtc_answer', {
        roomId,
        type: 'wetrtc_answer',
        sdp: sessionDescription,
      })
    } catch(e) {
      console.error(e);
    }
  }

  /*ICE에이전트가 신호 서버를 통해 다른 피어에게 메시지를 전달해야 할 때마다 발생, 
    이를 통해 ICE 에이전트는 브라우저 자체가 시그널링에 사용되는 기술에 대한 특정 정보를 알 필요없이 원격 피어와 협상을 수행할 수있다.
    ICE 후보를 원격 피어로 보내기 위해 선택한 메시징 기술을 사용하려면 아래의 'candidate 이벤트 핸들러'를 사용 
  
  */
  function sendIceCandidate(event:RTCPeerConnectionIceEvent) {
    if (event.candidate) {
      sc!.emit('webrtc_ice_candidate', {
          roomId,
          label: event.candidate.sdpMLineIndex,
          candidate: event.candidate.candidate
        })
    } else {
      // All ICE candidates have been sent
    }
  }
  function showVideoConference() {
    roomSelectionContainer?.setAttribute('style', '{display:"block"}');
    videoChatContainer?.setAttribute('style', '{display:"block"}');
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
    videoRef!.current!.srcObject! = localStream;
    
  }
  
  function addLocalTracks(rtcPeerConnection: RTCPeerConnection) {
    /*#addTracks
     addTrack() adds a new media track to the set of tracks which will be transmitted to the other peer.
     > track: 피어 연결에 추가될 미디어 트랙을 나타내는 '오디오'나 '비디오' :단일 미디어 트랙
     > ...streams:트랙이 추가되어야하는 하나 혹은 여러개의 로컬 'MediaStream 객체' 
     > MediaStream 안에 MediaStreamTrack이 있다. 그래서 이 trackd만 교체 해준다. 
     *audio track: 오디오 신호 정보가 있는 트랙, 우리가 아는 wav, mp3등 오디오 정보가 기록
     *medi track: 음의 높이, 길이, 음량, 떨림 등을 객관적인 데이터로 표현
  
     > tcPeerConnection.addTrack:다른 유저에게 전송될 트랙들의 묶음에 신규 미디어트랙을 추가
    */  
    localStream?.getTracks().forEach((track) => {
      rtcPeerConnection.addTrack(track, localStream);
    })
  }
  // ====================================== Conference function End ===================================
 
  // ====================================== Chatting function =========================================
  const setUName = () => {
    sc!.emit('joinRoom', { userName: userId, roomId: roomId } )

  }
  let fileUrl: string = '';
  const sendMessage = async () => {
    
    try {
      if (DraggedFile.length !== 0) {
        setLoading(true);
        const actualFile = DraggedFile[0]
        const formBody = new FormData();
        formBody.append('file', actualFile)
        const { url: ImageUrl } = await ( 
          await fetch("http://localhost:3000/upload/", {
            method: 'POST',
            body: formBody,
          })
           ).json()
        fileUrl = ImageUrl;
        
      }

     if (inputMessage.trim() !== '') {
       if(userId === ''){
         alert('로그인 또는 참가 닉네임을 설정하세요!')
         return new Error('닉네임 없음');
       } else {
         // 서버로 메시지 전송: 메세지 + 이미지를 같이 보낸다.
       // eslint-disable-next-line no-useless-concat
       sc!.emit('message', [`${userId}:` + "  " + inputMessage, fileUrl]); 
       setInputMessage('');
       fileUrl = String('');
       console.log("메세지가 있는 경우 fileUrl 값 확인:")
       setDragFile([]);
      }
       
     } else if(inputMessage.trim() === '') {
       if(userId === ''){
         alert('로그인 또는 참가 닉네임을 설정하세요!')
         return new Error('닉네임 없음');
       } else if (fileUrl !== ''){
         sc!.emit('message', [`${userId}:`+ inputMessage, fileUrl]); 
         setInputMessage('');
         setDragFile([]);
       }
     }
    } catch (e) {}
  };

  const handleOnCheck = (event:any) => {
    //:ChangeEvent<HTMLInputElement>
    //event.target.checked 속성을 사용하여 checkbox의 체크 여부를 확인
    //<input> 태그의 checked 속성은 페이지가 로드될 때 미리 선택될 <input> 요소를 명시
    const isChecked = event.target.checked;
    setDarkAtom(isChecked)
  } 

  const onDrop = useCallback( (acceptedFiles:any) => {
    // 파일이 드롭됐을 때의 로직을 처리합니다.
    console.log(acceptedFiles);
    setDragFile(acceptedFiles)

  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg'],
      'image/png': ['.png'],
      'video/mp4': ['.mp4', '.MP4'],
    }
  });

  const fileInputRef = useRef(null);
  const handleFileDelete = (e:React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.value = '';
  };
  return (
  <StreamingWrapper>
    <div id="room-selection-container" className='centered' >
      <h1>WebRTC video Conference</h1>
      <label>Enter the number of the room you want to connect</label>
      <form onSubmit={joinRoomButton}> 
        <input id='room-input' type='text' ref={roomInputRef}/>
        <button>roomId 제출</button>
      </form>
    </div>
    <div id="video-chat-container" className='video-position flex' style={{display:"block"}}>
      <video id="local-video" autoPlay loop muted width="30%" height="30%" ref={videoRef} ></video>
      <video id="remote-video" autoPlay loop muted width="30%" height="30%" ref={remoteVideoRef}> </video>
    </div>
    <ChatContainer className='border border-solid border-gray-300 p-4 flex-1 flex flex-col items-center justify-center'>
      <label className="relative flex justify-between items-center group p-2 text-xl">
        <input
          type="checkbox" 
          className="toggle absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md" 
          onChange={handleOnCheck}
        />
        <span className="w-16 h-10 flex items-center flex-shrink-0 ml-4 p-1 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-8 after:h-8 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6 group-hover:after:translate-x-1"></span>
      </label>
      <div className="rounded-lg w-2/4 bg-gray-300 shadow-lg text-white p-4">
        <h1 className="text-2xl font-semibold mb-4">Users in this room</h1>
        <ul>
          {joinedUserList && joinedUserList!.map((user, index) => (
            <li key={index} className="mb-2 font-semibold">{user}님 </li>
          ))}
        </ul>

        <h1 className="text-2xl text-center font-semibold mb-4">📢안내</h1>
        <ul>
        {joinedUserList && particapants!.map((userName, index) => (
            <li key={index} className='font-semibold'>{userName}</li>
          ))}
        </ul>
      </div>

        <ChatContent className='   shadow-lg rounded-lg custom-scrollbar w-2/4 h-96 overflow-y-scroll overflow-x-scroll'>
          <h3 className='text-lg text-center mt-2 font-bold'>대화 내용</h3>
          {messages && messages.map((message, index ) => (
            <div>
              <p className='mr-4 ml-4 mt-4 bg-white p-2 shadow-md rounded-md' key={index}>{message.msg}</p>
              {(message.url.includes('.png') || message.url.includes('.jpg') || message.url.includes('.JPG') ) ? (
                <img key={message.url} alt='사진' src={message.url} style={{ width: "300px"}} className=' ml-4 mt-1 rounded-md' />  
              ): null}

              <RplayerWrapper>  
                {(message.url.includes('.mp4') || message.url.includes('.MP4') )? (
                    <ReactPlayer 
                      key={message.url}
                      className="player "
                      url={message.url}
                      width="80%"
                      height="30%"
                      controls={true}
                      playing={true}
                  />
                  
                  ) : null}
              </RplayerWrapper>
              <p className='text text-right text-sm mr-4' key={message.time}>{message.time}</p>
            </div>
          ))}
          
        </ChatContent>
 
      <UI className=' w-2/4'>
          <input
            className='flex-1 border rounded px-2 py-1 mt-2 focus:outline-none focus:ring focus:border-blue-300'
            type="text"
            value={userId}

            size={10}
          />
          <button onClick={setUName}>참가</button>
      
          <input
            className='flex-1 border rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300'
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          
          <div 
           {...getRootProps()}
           className="flex items-center justify-center w-full  mt-2 ">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-50 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor"  strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG, GIF  (MAX. 800x400px) or MP4</p>
              </div>
              
            </label>
            <input
              {...getInputProps()}
              type="file"
            />
              
          </div>      
        <button onClick={() => sendMessage()} className='min-w-full mx-auto mt-2 mb-4 bg-white p-6 rounded-md shadow-md'>Send</button>
      </UI>
    </ChatContainer>
    {isLoading ? ( <LoadingSvg className=" animate-load " width={"50px"} height={"50px"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/>
      </LoadingSvg> ) : null
    }
  
  </StreamingWrapper>
  
  )
} 









