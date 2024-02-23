import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Socket, io } from "socket.io-client";
import styled from 'styled-components';
import { WS_BASE_PATH } from "./chatting";
const Btn = styled.button`
  display: flex;
  justify-content: center; /* 수평 가운데 정렬 */
  align-items: center; /* 수직 가운데 정렬 */
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


interface IcameraDevicesInfo {
  deviceId:string; 
  groupId:string; 
  kind:string; 
  label:string
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
export function Conference() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const selectRef = useRef(null)
  const [isMuted, setMuted] = useState(false);
  const [isCameraOff, setCameraOff] = useState(false)
  const [cameraDevices, setCameraDevices] = useState<IcameraDevicesInfo[]>();
  const [cameraId, setCameraId] = useState<string>("")
  const [socket, setSocket] = useState<Socket>();
  const [roomId, setRoomId] = useState<string>("")
  const [camON, setCamON] = useState(false);
  const {register, getValues} = useForm();


  // 강의에서는 PeerA가 'Brave' PeerB가 'FireFox'
  useEffect(() => {  
    let socket = io(`${WS_BASE_PATH}`, {
      transports:['websocket'], 
    },
    ) 
    setSocket(socket)
    
    socket.on("welcom", async () => { 
      // Peer A(파이어 폭스)가 offer 생성 
      const offer = await myPeerConnection.createOffer();
      // PeerA, FireFox 브라우저에서만 실행 
      await myPeerConnection.setLocalDescription(offer); 
      console.log("PeerA just Join!")
      console.log(offer);
      // Peer A가 Peer B에 보낸다. 
      socket.emit("offer", offer, roomName)
    })
    socket.on("offer", async (offer) => {
      console.log("received the offer");
    //Peer B(크롬)에서만 실행하며(내peer의 description에서 설정)'offer'를 받아서 '상대방의 peer의 description'을 세팅한다. 
      myPeerConnection.setRemoteDescription(offer); 
      const answer = await myPeerConnection.createAnswer();
      myPeerConnection.setLocalDescription(answer);
      socket.emit("answer", answer, roomName)
      console.log("sent the answer");
    } )

    socket.on("answer", async(answer) => {
      console.log("received the answer");
      const a = await myPeerConnection.setRemoteDescription(answer)
      console.log("a:")
      console.log(a)
    })

    socket.on("ice", (ice) => {
      myPeerConnection.addIceCandidate(ice);
    })

    return () => {
      socket.disconnect();
    };
  }, [])
  //✅
  async function getCameras () {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      // devies에서 kind = "videoinput" 만 추출 
      const cameras = devices.filter(device => device.kind === "videoinput");
      let currentCamera = myStream.getVideoTracks()[0]; //Logi C270 HD WebCam (046d:0825)
      currCamera = currentCamera;
      setCameraDevices(cameras);
 
    } catch(e) {
      console.error(e);
    }
  }
  //유저의 카메라와 오디오를 가져온다. 
  const getUserMedia = async (cameraId:string) => {
    //모바일: 카메라 앞을 가져옴
    const initalConstraints = {
      audio:true,
      vidoe:{ facingMode: "user"}
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
      console.log('myStream:');
      console.log(myStream);
      videoRef!.current!.srcObject = myStream;
      getCameras();
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
    myPeerConnection= new RTCPeerConnection();   //2번, iceServers
    myPeerConnection.addEventListener("icecandidate", handleIce);
    myStream.getTracks().forEach(track => myPeerConnection.addTrack(track, myStream));
  }
  function handleIce(data: any) {
    socket?.emit("ice", data.candidate, roomName)
    console.log("got ice candidate ");
    console.log(data);
  }

  async function initialCall(eventValue:any) {
    await getUserMedia(eventValue);
    makeConnection();
  }

  const handleCameraChange = (event:any) => {
    setCameraId(event.target.value);
    initialCall(event.target.value); //myPeerConnection 형성 완료를 위해 기다림이 필요!
  }
  const handleWelcomeSubmit = (event:any) => {
    event.preventDefault();
    const {roomId} = getValues();
    if(roomId === "") return;
    initialCall(cameraId); //initialCall(cameraId); 
    socket!.emit("join_room", roomId)
    roomName = roomId //방에 참가 했을 때 나중에 쓸 수 있도록 방 이름을 변수에 저장
    setRoomId("")
    setCamON((prev) => !prev)
    
  }
  return (
    <div className=" mt-4 ">
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
      {/*call 아이디는 초기 로드시 hidden 상태*/}
    
      {camON ?
        <div id="call">
          <div id="myFace" className='video-position flex' style={{display:"block"}}>
            <video  autoPlay loop muted  ref={videoRef}></video>
            <select onChange={handleCameraChange} id="camerasSelectRef" ref={selectRef} >
              <option value={""}>{"Camera Option"}</option>
              {cameraDevices?.map((camera, index) => (
                <option 
                  key={index} 
                  value={camera.deviceId}
                  //selected={}
                  >
                  {camera.label}
                </option>
              ))}
            </select>
            <div>
      
            </div>
            <Btn id="muteBtn" onClick={handleMuteClick}>{isMuted ? "Unmuted"  : "Mute" }</Btn>
            <Btn id="camera" onClick={handleCameraClick}>{isCameraOff ? "Turn Camera On" : "Turn Camera Off"}</Btn>
          </div>
        </div> 
        : null
      }
      <p className='mt-6 mb-6 text-center font-semibold text-2xl '>We are currently testing the beta. We ask for your understanding of the inconvenience.</p>
      <p className='text-center font-semibold text-2xl'> Thank you for coming 💛 </p>
      <br />

    </div>
  )
}