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



let myStream: MediaStream;
let currCamera: MediaStreamTrack;
export function Conference() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setMuted] = useState(false);
  const [isCameraOff, setCameraOff] = useState(false)
  const [cameraDevices, setCameraDevices] = useState<IcameraDevicesInfo[]>();
  const [cameraId, setCameraId] = useState<string>("")
  const [socket, setSocket] = useState<Socket>();
  const [roomId, setRoomId] = useState<string>("")
  
  const {register, getValues} = useForm();



  useEffect(() => {
    let socket = io(`${WS_BASE_PATH}`, {
      transports:['websocket'], 
    },
    ) 
    setSocket(socket)
    
    getUserMedia(cameraId);
    return () => {
      socket.disconnect();
    };
  }, [])
  async function getCameras () {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      // devies에서 kind = "videoinput" 만 추출 
      const cameras = devices.filter(device => device.kind === "videoinput");
      //setCameras(cameras)
      console.log('전체 cameras:')
      console.log(cameras);
      console.log("지금 선택된 video")
      let currentCamera = myStream.getVideoTracks()[0]; //Logi C270 HD WebCam (046d:0825)
      currCamera = currentCamera;
      console.log("currCam")
      console.log(currCamera)
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
      myStream = await navigator.mediaDevices.getUserMedia(
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

  const handleCameraChange = (event:any) => {
    console.log(event.target.value)
    setCameraId(event.target.value);
    getUserMedia(event.target.value)
  }
  const handleSubmit = (event:any) => {
    const {roomId} = getValues();
    event.preventDefault();
    console.log(roomId);
    socket!.emit("join_room", roomId)
    setRoomId("")
  }
  return (
    <div className=" mt-4 ">
      <Helmet>
        <title>Trader | Conference </title>       
      </Helmet> 
      <RoomContainer id="welcom" className="w-2/4 mx-auto bg-white p-6 rounded-md shadow-md">
        <form className=" flex flex-col ">
          <input
            {...register("roomId",)}
            type="text"
            value={roomId}
            placeholder="room name"
          >
          </input>
          <EnterBtn 
            className=""
            onClick={handleSubmit}
          >Enter Room
          </EnterBtn>
        </form>
      </RoomContainer>
      {/*call 아이디는 초기 로드시 hidden 상태*/}
      <div id="call">
        <div id="myFace" className='video-position flex' style={{display:"block"}}>
          <video  autoPlay loop muted  ref={videoRef}></video>
          <select onChange={handleCameraChange} id="camerasSelectRef">
            <option value={""}>{"Camera Option"}</option>
            {cameraDevices?.map((camera, index) => (
              <option 
              key={index} 
              value={camera.deviceId}
              //selected={camera.label ? true : false}
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
      <p className='mt-6 mb-6 text-center font-semibold text-2xl '>We are currently testing the beta. We ask for your understanding of the inconvenience.</p>
      <p className='text-center font-semibold text-2xl'> Thank you for coming 💛 </p>
      <br />

    </div>
  )
}