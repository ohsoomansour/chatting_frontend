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

const ConferencerWrapper = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  
`;
const CamContainer = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
`
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
  const {register, getValues} = useForm();


  // 강의에서는 PeerA가 'Brave' PeerB가 'FireFox'
  useEffect(() => {  
    let socket = io(`${WS_BASE_PATH}`, {
      transports:['websocket'], 
    },
    ) 
    setSocket(socket)
    
    socket.on("welcome", async () => { 
      // Peer A(파이어 폭스)가 offer 생성 
      const offer = await myPeerConnection.createOffer();
      // PeerA, FireFox 브라우저에서만 실행 
      await myPeerConnection.setLocalDescription(offer); 
      console.log("PeerA just Join!")
      // Peer A가 Peer B에 보낸다. 
      socket.emit("offer", offer, roomName)
    })
    socket.on("offer", async (offer) => {
      console.log("received the offer");
    //Peer B(크롬)에서만 실행하며(내peer의 description에서 설정)'offer'를 받아서 '상대방의 peer의 description'을 세팅한다. 
      await myPeerConnection.setRemoteDescription(offer); 
      const answer = await myPeerConnection.createAnswer();
      await myPeerConnection.setLocalDescription(answer);
      socket.emit("answer", answer, roomName)
      console.log("sent the answer");
    } )

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
  //✅
  /*
  async function getCameras () {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      // devies에서 kind = "videoinput" 만 추출 
      const cameras = devices.filter(device => device.kind === "videoinput");
      setInitCamera(cameras[0])
      console.log("cameras:");
      console.log(cameras);
      let currentCamera = myStream.getVideoTracks()[0]; //Logi C270 HD WebCam (046d:0825)

      currCamera = currentCamera;
      setCameraDevices(cameras);
 
    } catch(e) {
      console.error(e);
    }
  }
  */
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
      {/*call 아이디는 초기 로드시 hidden 상태*/}
    
      {camON ?
      <CamContainer>
        <video  autoPlay loop muted  ref={videoRef}></video>
        <video  autoPlay loop muted  ref={peerVideoRef}></video>
      
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
          <Btn id="muteBtn" onClick={handleMuteClick}>{isMuted ? "Unmuted"  : "Mute" }</Btn>
          <Btn id="camera" onClick={handleCameraClick}>{isCameraOff ? "Turn Camera On" : "Turn Camera Off"}</Btn>
        </div>
      </CamContainer>

      : null
      }
      <p className='mt-6 mb-6 text-center font-semibold text-2xl '>We are currently testing the beta. We ask for your understanding of the inconvenience.</p>
      <p className='text-center font-semibold text-2xl'> Thank you for coming 💛 </p>
      <br />

    </ConferencerWrapper>
  )
}