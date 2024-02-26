import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Socket, io } from "socket.io-client";
import styled from 'styled-components';
import { WS_BASE_PATH } from "./chatting";
import SimplePeer from 'simple-peer';
const Btn = styled.button`
  display: flex;
  justify-content: center; 
  align-items: center; 
  font-size: 15px;
  height: 35px;
  width:200px;
  margin-top:10px;
  border: none;
  outline: none;
  cursor:pointer;
  color: #D0EE17;
  background-color: gray;
  transition: background-color 0.3s ease-in-out;
  &:hover {
    background-color: #696969;
  }
  box-shadow: 0px 20px 30px rgba(0, 0, 0, 0.3);
`;
const RoomContainer = styled.div`
  display:flex;
`
const EnterBtn = styled.button`
  background-color:gray;
  transition: background-color 0.3s ease-in-out;
  &:hover {
    background-color: #00FF80;
  }
`;

const ConferencerWrapper = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  
`;
const CamWrapper = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
`;
const VideoContainer = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
`;
const BtnContainer = styled.div`
  display:flex;
`;
const ChatContent=styled.div`
  color:${(props) => props.theme.textColor};
  background-color: whitesmoke;
  margin-top: 100px;
`;

const PeerMessage = styled.div`
  display:flex;
  flex-direction: row;
`
const Mymessage = styled.div`
  display:flex;
  flex-direction: row-reverse;
`;


interface IcameraDevicesInfo {
  deviceId:string; 
  groupId:string; 
  kind:string; 
  label:string
}
interface IChat {
  msg:string;
  isMe:boolean;
}

const iceServers = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302'},
    { urls: 'stun:stun1.l.google.com:19302'},
    { urls: 'stun:stun2.l.google.com:19302'},
    { urls: 'stun:stun3.l.google.com:19302'},
    { urls: 'stun:stun4.l.google.com:19302'},
  ]
}

let myStream: MediaStream;
let currCamera: MediaStreamTrack;
let roomName: string;
let myPeerConnection: RTCPeerConnection;;
let myDataChannel: RTCDataChannel;



export function Conference() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerVideoRef = useRef<HTMLVideoElement>(null)
  const selectRef = useRef(null)

  const [isMuted, setMuted] = useState(false);
  const [isCameraOff, setCameraOff] = useState(false)
  const [cameraDevices, setCameraDevices] = useState<IcameraDevicesInfo[]>();
  const [cameraId, setCameraId] = useState<string>("")
  const [initCamera, setInitCamera] = useState<IcameraDevicesInfo>()
  const [socket, setSocket] = useState<Socket>();
  const [roomId, setRoomId] = useState<string>("")
  const [camON, setCamON] = useState(false);
  //const [sendMessage, setSendmessage] = useState<IChat[]>([{msg:"", isMe: true}]);
  const [messages, setMessages] = useState<IChat[]>([{msg:"", isMe: true}]);
  const {register, getValues} = useForm({mode:"onChange"});

  // 강의에서는 PeerA가 'Brave' PeerB가 'FireFox'
  useEffect(() => {  
    // SimplePeer 인스턴스 생성


    let socket = io(`${WS_BASE_PATH}`, {
      transports:['websocket'], 
    },
    ) 
    setSocket(socket)
    //Failed to execute 'send' on 'RTCDataChannel': RTCDataChannel.readyState is not 'open'
    socket.on("welcome", async () => { 
      //Peer A에서만 실행(상대 peerB에서는 만들 필요가 없다. )
      myDataChannel = myPeerConnection.createDataChannel("chat");
      console.log("made data channel");
      //🌟 대화형 구현 1
      myDataChannel.onopen = () => {
        console.log('Data channel opened');
        if(myDataChannel.readyState === "open"){

          myDataChannel.send("Hi peer B! my ready State is being 'open' ")
        }
      };
      myDataChannel.addEventListener("message", (event:MessageEvent<any>) => {
        //🌟아이디어: 여기서 메세지를 받을 때 setIsMymsg(prev => !prev)   + html 태그에 추가되는 코딩을 해야되는 거다 
        console.log("Peer A Received message:", event.data);
        //🌟아이디어: [{msg:"", isMe: false }] -> message.isMe? 오른쪽 : 왼쪽  -> 전체 메세지에 넣는거지 
        setMessages((prev) => [...prev, {msg:event.data, isMe:false}]); 
      });
      // Peer A(파이어 폭스)가 offer 생성 
      const offer = await myPeerConnection.createOffer();
      // PeerA, FireFox 브라우저에서만 실행 
      await myPeerConnection.setLocalDescription(offer); 
      console.log("PeerA just Join!")
      // Peer A가 Pe er B에 보낸다. 
      socket.emit("offer", offer, roomName)
    })
    socket.on("offer", async (offer) => {
      myPeerConnection.addEventListener("datachannel", (event:RTCDataChannelEvent) =>{
        console.log("datachannel 발생 함!")
        console.log(event);
        myDataChannel = event.channel; //peer B에서 설정
        //🌟 대화형 구현 2
        
        myDataChannel.addEventListener("message", (event:any) => {
          console.log("Peer B Received message:", event.data);
          setMessages((prev) => [...prev, {msg:event.data, isMe: false}]) //setMessages((prev) => [...prev, event.data]); 
        })
        myDataChannel.onopen = () => {
          console.log('Data channel opened');
          if(myDataChannel.readyState === "open"){
            
            const {sendMessage} = getValues();
            console.log(sendMessage)
            myDataChannel.send("Hi Peer A")
          }
        };
        /*
        myDataChannel.onmessage = (event) =>{
          console.log("offer에서 메세지 수신")
          console.log(event.data)
          
        }*/
      })
      console.log("received the offer");
    //Peer B(크롬)에서만 실행하며(내peer의 description에서 설정)'offer'를 받아서 '상대방의 peer의 description'을 세팅한다. 
      await myPeerConnection.setRemoteDescription(offer); 
      const answer = await myPeerConnection.createAnswer();
      await myPeerConnection.setLocalDescription(answer);
      socket.emit("answer", answer, roomName)
      console.log("sent the answer");
    })
    
    

    socket.on("chat", () => {

    })

    
    socket.on("answer", async(answer) => {
      console.log("received the answer");
      await myPeerConnection.setRemoteDescription(answer)
    })

    socket.on("ice", async (ice) => {
      console.log("received candidate");
      await myPeerConnection.addIceCandidate(ice);  //answer 보낸 후
    })
    async function getCameras () {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
  
        // devies에서 kind = "videoinput" 만 추출 
        const cameras = devices.filter(device => device.kind === "videoinput");
        setInitCamera(cameras[0])
        setCameraDevices(cameras);
        console.log("cameras:");
        console.log(cameras);
        let currentCamera = myStream.getVideoTracks()[0]; //Logi C270 HD WebCam (046d:0825)
  
        currCamera = currentCamera;
        
   
      } catch(e) {
        console.error(e);
      }
    }
    getCameras ();
    return () => {
      socket.disconnect();
    };
  }, [])


  //유저의 카메라와 오디오를 가져온다. 
  const getUserMedia = async (cameraId:string) => {
    //모바일: 카메라 앞을 가져옴
    const initalConstraints = {
      audio:true,
      vidoe:true, //{ facingMode: "user"}
    };
    const cameraConstraints = {
      audio:true,
      video: {
        width: 300,
        height: 300,
        deviceId: {exact: cameraId }
      }
    }
 
    try { 
      //enumerateDevices() : 컴퓨터에 연결되거나 모바일이 가지고 있는 장치
      myStream = await navigator.mediaDevices.getUserMedia( //1번
        cameraId ? cameraConstraints : initalConstraints
      )

      videoRef!.current!.srcObject = myStream;
      //getCameras();
    } catch (e) {
      console.error(e);
    }
  }
 
  const handleMuteClick = () => {
    //audio가 하나의 track (자막, 비디오등)  
    myStream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setMuted(prev => !prev);

  }
  
  const handleCameraClick = () => {
    myStream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled))
    setCameraOff(prev => !prev);
  }
  //RTC Code -> 누구나 myStream에 접촉 할 수 있도록 -> ✅구글의 STUN 서버들 사용하여 연결
  function makeConnection() {
    //누구나 myStream에 접촉 할 수 있도록, 크롬 브라우저와 FireFox에 만드는거다. 
    myPeerConnection = new RTCPeerConnection(iceServers);
    myPeerConnection.addEventListener("icecandidate", handleIce);
    myPeerConnection.addEventListener("addstream", handleAddStream);
    myStream.getTracks().forEach(track => myPeerConnection.addTrack(track, myStream));
    //stream은 통째로 바꾸는데 track은 바꾸지 않고 있다. 
    //Sender는 우리의 peer로 보내진 media stream track을 컨트롤해준다. 
    
  }
  function handleIce(data: any) {
    socket!.emit("ice", data.candidate, roomName)
    console.log("got ice candidate ");
  }
  function handleAddStream(data:any) {
    console.log("addstream이벤트 이제 시작!")
    peerVideoRef!.current!.srcObject = data.stream; //문제가 data.stream이 null값 
    console.log("myStream:", myStream)
    console.log("peerStream:", data.stream)
  }

  async function initialCall(deviceId:any) {
    await getUserMedia(deviceId);
    makeConnection(); 
  }
   
  const handleCameraChange = async (event:any) => {
    setCameraId(event.target.value);
    await getUserMedia(event.target.value); //새로운 stream을 받는다.  
    if(myPeerConnection){
      const videoTrack = myStream.getVideoTracks()[0]; //
      console.log("videoTrack:")
      console.log(videoTrack)
      const videoSender = myPeerConnection
        .getSenders()
        .find((sender) => sender.track?.kind === "video");
      videoSender?.replaceTrack(videoTrack);
      console.log("videoSender:");
      console.log(videoSender);
    }
  }
  const handleWelcomeSubmit = async(event:any) => {
    event.preventDefault();
    const {roomId} = getValues();
    if(roomId === "") return;
    await initialCall(initCamera?.deviceId); //initialCall(cameraId); 
    /*
     문제 추정1. 처음 시작하는 stream은  addstream 생성 전 그런데 상대 peer가 join했을 때 이미 addstream 이벤트가 지나가고 r
     peer의 stream이 없다 -> mystream이 없음 -> addstream 이벤트 실행시 상대 peer의 stream이 없고 이미 ice candidate 까지 지나감 -> 이제 카메라를 바꿈 
      -> 그러니까 그다음 조인했을 때 그 전의 stream을 반영한다!
    
    */
    socket!.emit("join_room", roomId)
    roomName = roomId //방에 참가 했을 때 나중에 쓸 수 있도록 방 이름을 변수에 저장
    setRoomId("")
    setCamON((prev) => !prev)
  }
  
  function formatCurrentTime(): string {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`; // 01:01:11 형태 반환 
  }

  function handleChatSubmit(event:any) {
    event.preventDefault();
    const {sendMessage} = getValues();
    setMessages((prev) => [...prev, {msg: sendMessage, isMe: true}]);
    myDataChannel.send(sendMessage);
  }
  const currentTime = formatCurrentTime();
  return (
    <ConferencerWrapper className=" mt-4 ">
      <Helmet>
        <title>Trader | Conference </title>       
      </Helmet> 
      <RoomContainer id="welcom" className="w-2/4 mx-auto bg-white p-6 rounded-md shadow-md">
        <form className=" flex flex-col ">
        <input
            {...register("roomId")}
            type="text"
            placeholder="room name"
          >
          </input>
          <EnterBtn 
            className=""
            onClick={handleWelcomeSubmit}
          >Enter Room
          </EnterBtn>
        </form>
      </RoomContainer>
  
      {camON ?
      <CamWrapper>
        <VideoContainer className="mt-4">
          <video  autoPlay loop muted  ref={videoRef}></video>
          <video  autoPlay loop muted  ref={peerVideoRef} className="ml-4"></video>
        </VideoContainer >
        <div>
          <select onChange={handleCameraChange} id="camerasSelectRef" ref={selectRef} >
            <option value={""}>{"Camera Option"}</option>
            {cameraDevices?.map((camera, index) => (
              <option 
                key={index} 
                value={camera.deviceId}
                >
                {camera.label}
              </option>
            ))}
          </select>
          <BtnContainer>
            <Btn id="muteBtn" onClick={handleMuteClick}>{isMuted ? "Unmuted"  : "Mute" }</Btn>
            <Btn id="camera" onClick={handleCameraClick} className="ml-4">{isCameraOff ? "Turn Camera On" : "Turn Camera Off"}</Btn>
          </BtnContainer>
        </div>
      </CamWrapper>

      : null
      }
      {/* 방법1. 변수를 통해서  */}
      <ChatContent className=" shadow-lg rounded-lg custom-scrollbar w-2/4 h-96 overflow-y-scroll overflow-x-scroll">
        {messages.map((message, index) => (

          message.isMe 
            ? 
          <Mymessage key={index}>
            <div>
              <p className=' text text-black mr-4 ml-4 mt-4 bg-white p-2 shadow-md rounded-md' >{message.msg}</p> 
              <p className='text text-right text-sm mr-4' >{currentTime}</p>
            </div>
          </Mymessage>
            :
          <PeerMessage key={index}>
            <div> 
              <p className=' text text-black mr-4 ml-4 mt-4 bg-white p-2 shadow-md rounded-md' >{message.msg}</p> 
              <p className='text text-right text-sm mr-4' >{currentTime}</p>
            </div>

          </PeerMessage>
        ))}

        {
          
        }
      </ChatContent>
        <form className="mt-6" onSubmit={handleChatSubmit}>
          <input
            className="flex-1 border rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
            type="text"
            {...register("sendMessage", {required:true})} 
          />
          <button className=" font-semibold ml-2 bg-white p-2 shadow-md rounded-md" >Send</button>
        </form>
      <footer>
        <p className='mt-10 mb-6 text-center font-semibold text-2xl '>We are currently testing the beta. We ask for your understanding of the inconvenience.</p>
        <p className='text-center font-semibold text-2xl'> Thank you for coming 💛 </p>
      </footer>
      <br />

    </ConferencerWrapper>
  )
}