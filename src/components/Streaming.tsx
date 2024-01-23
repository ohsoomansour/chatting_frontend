/**/
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { useForm } from "react-hook-form";
import styled from 'styled-components';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { isDarkAtom } from '../recoil/atom_Theme';
//배경: 진한 그레이 -> 채팅창: 형광
const StreamingWrapper  = styled.div`
  background-color: ${(props) => props.theme.bgColor}
`
const ChatWrapper = styled.div`
  border: ${(props) => `2px solid ${props.theme.accentColor}`}
`
interface ImsgObj{
  msg:string;
  img:string;
}
interface IFormProps {
  file: FileList
}
interface IProps {
  msg:string;
  img:string;
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
let remoteStream : MediaStream; 


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
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const roomInputRef = useRef<HTMLInputElement>(null);
  const [sc, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<IProps[]>([{msg:'', img: ''}]);
  console.log("messages현재 값:")
  console.log(messages)
  const [inputMessage, setInputMessage] = useState('');
  const [userName, setUsername] = useState('');
  const [joinedUserList, setJoinedUserList] = useState<string[]>(['']);
  const [particapants, setParticapants] = useState<string[]>([''])
  const [uploading, setUploading] = useState(false)
  const [ImageUrl, setImageUrl] = useState<string>("")
  const [recImgURL, setRecImgURL] = useState<string[]>([""]);

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
     /* #setState((prevState) => prevState + 1); 활용 + 두 번 msgObj가 들어온다!    
      > 문제: 처음 roomId입력 -> 참가자 입력 후 -> 메세지가 2번 랜더링 되는 현상 
      > 추정1: React re-rendering조건 중 setMessages() 실행 후 -> re-rendering: 'state 변경이 있을 때'
        - 리액트는 코드를 끝까지 읽은 후 setState함수들(임시 저장소)을 한 번에 업데이트 
          그리고 나서 re-renderings 하지만 변경된 값만 다시 그려짐 버튼 태그를 다시 repainting하지 않는다.
            setMessages([msgObj]); 이렇게 했을 때 리랜더링 때문에가 아닌 걸 알 수 있음
     
      > 추정2. setMessages((prev) => [...prev, msgObj]); 
          */
    setMessages((prev) => [...prev, msgObj]); 
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
  // ====================================== Chatting function ===================================
  
  const sendMessage = () => {
    /*경우1.() 메세지가 없는 경우는 당연히 보내고 
      Q.button태그가 re-rendering되어 메세지를 한 번 더 보낸다. ? 
      A. 컴포넌트가 리랜더링 된다 그러나 변경된 부분만 변경 
         여기서 소켓 on.('message')에서 다시 그 값을 받아오기 때문에 메세지가 두 번 
    */ 
    if (inputMessage.trim() !== '') {
      if(userName === ''){
        console.log(userName);
        alert('참가 닉네임을 설정하세요!')
        return new Error('닉네임 없음');
      } else {
        // 서버로 메시지 전송: 메세지 + 이미지를 같이 보낸다.
      sc!.emit('message', [`${userName}:`+ inputMessage, ImageUrl]); 
      setInputMessage('');
      setImageUrl('');
      }
      
    } else if(inputMessage.trim() === '') {
      if(userName === ''){
        alert('참가 닉네임을 설정하세요!')
        return new Error('닉네임 없음');
      } else if (ImageUrl !== ''){
        sc!.emit('message', [`${userName}:`+ inputMessage, ImageUrl]); 
        setImageUrl('');
      }
    }
  };
  const setUName = () => {
    sc!.emit('joinRoom', { userName: userName, roomId: roomId })
  }
  
  const {handleSubmit, getValues, register} = useForm<IFormProps>({
    mode:"onChange"
  })

  const onSubmit = async (e:any) => {
    e.preventDefault();
    try {
      setUploading(true)
      const { file  } = getValues();
      const actualFile = file[0]
      const formBody = new FormData();
      formBody.append('file', actualFile)
    
      const { url: coverImage } = await ( 
        await fetch("http://localhost:3000/upload/", {
          method: 'POST',
          //headers:{ 'Content-Type': 'multipart/form-data' },
          body: formBody,
        })
         ).json()
      setImageUrl(coverImage);
      /*1.11 이 이미지 URL를 어떻게 표출할 것인가 
       > S3에 저장되어 있음(DB에 저장 할 필요는 없음)
       > 서버의 'message' Subscribe에 보내서 message랑 함께 결합해서 나올 수 있게 한다.
      */
      
    } catch (e) {}
     
  }
  


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
   
  //============================================ Toggle ==============================================
  
  const handleOnCheck = (event:any) => {
    //:ChangeEvent<HTMLInputElement>
    //event.target.checked 속성을 사용하여 checkbox의 체크 여부를 확인
    //<input> 태그의 checked 속성은 페이지가 로드될 때 미리 선택될 <input> 요소를 명시
    const isChecked = event.target.checked;
    setDarkAtom(isChecked)
    console.log('isChecked:')
    console.log(isChecked);
  } 

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
    <div id="video-chat-container" className='video-position' style={{display:"block"}}>
      <video id="local-video" autoPlay loop muted width="100%" height="100%" ref={videoRef} ></video>
      <video id="remote-video" autoPlay loop muted width="100%" height="100%" ref={remoteVideoRef}> </video>
    </div>
    
    <label className="relative flex justify-between items-center group p-2 text-xl">
      <input
        type="checkbox" 
        className="toggle absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md" 
        onChange={handleOnCheck}
      />
      <span className="w-16 h-10 flex items-center flex-shrink-0 ml-4 p-1 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-8 after:h-8 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6 group-hover:after:translate-x-1"></span>
    </label>
    

    
    <ChatWrapper className='flex-1 flex flex-col items-center justify-center'>
      <div className="w-2/4 bg-slate-400 text-white p-4">
        <h1 className="text-2xl font-semibold mb-4">Users in this room</h1>
        <ul>
          {joinedUserList && joinedUserList!.map((user, index) => (
            <li key={index} className="mb-2">{user}님 </li>
          ))}
        </ul>
      </div>

      <div className="w-2/4 bg-slate-400 text-white p-4 " >
        <h1 className="text-2xl text-center font-semibold mb-4">📢안내</h1>
        <ul>
        {joinedUserList && particapants!.map((userName, index) => (
            <li key={index}>{userName}</li>
          ))}
        </ul>
      </div>
     
      <h3 className='text-lg font-bold'>대화 내용</h3>
      <div className='custom-scrollbar w-2/4 h-64 overflow-y-scroll overflow-x-scroll'>
        {messages && messages.map((message, index ) => (
          <div>
            <p key={index}>{message.msg}</p>
            <img alt='' src={message.img} style={{ width: "200px"}}/>
          </div>
        ))}
        
        { recImgURL && recImgURL.map((img, index) => (
          <div> 
            <img key={index} alt='' src={img} style={{ width: "200px"}}/>
          </div>
        ))}
      </div>

      <div>
      닉네임:
      <input
        className='flex-1 mr-2 border rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300'
        type="text"
        value={userName}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={setUName}>참가</button>
      message:
      <input
        className='flex-1 mr-2 border rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300'
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />
      <button onClick={() => sendMessage()}>Send</button>
      </div>
      <form
        onSubmit={handleSubmit((e) => onSubmit(e))}
      >
        <input
          {...register("file", { required: true })}
          type="file"
          accept="image/*"
        />  
        <button>이미지 올리기</button>
      </form>
    </ChatWrapper>
    

  </StreamingWrapper>
  
  )
} 







