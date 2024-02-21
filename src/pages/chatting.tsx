import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import styled from 'styled-components';
import {  useRecoilValue, useSetRecoilState } from 'recoil';
import { isDarkAtom } from '../recoil/atom_Theme';
import ReactPlayer from "react-player";
import { userIdState } from '../recoil/atom_user';
import React, { useCallback } from 'react';
import {useDropzone} from 'react-dropzone'
import { Loading } from '../components/loading';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { BASE_PATH } from './logIn';
import { tokenState } from '../recoil/atom_token';

const StreamingWrapper=styled.div`
  background-color: ${(props) => props.theme.bgColor};
`;
const ChatContent=styled.div`
  color:${(props) => props.theme.textColor};
  background-color: whitesmoke;
`;
export const UI = styled.div`
  display:flex;
  flex-direction: column;
`;
const ChatContainer = styled.div``;
const RoomId = styled.div`
  display:flex;
  flex-direction: column;
`
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
//https://trade-2507d8197825.herokuapp.com
export const WS_BASE_PATH = process.env.NODE_ENV === "production" 
 ? `wss://trade-2507d8197825.herokuapp.com`
 : "http://localhost:8080"


export default function Chatting() {
  const userId = useRecoilValue(userIdState);
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const token = useRecoilValue(tokenState);
  const {register, getValues} = useForm({mode: "onChange"})
  const [sc, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<IProps[]>([{msg:'', url: '', time: ''}]);
  const [inputMessage, setInputMessage] = useState('');
  const [joinedUserList, setJoinedUserList] = useState<string[]>(['']);
  const [particapants, setParticapants] = useState<string[]>([''])
  const [DraggedFile, setDragFile] = useState([])
  const [isLoading, setLoading] = useState(false);
 
  useEffect(() => {
    let sc = io(`${WS_BASE_PATH}/socket.io`, {
      withCredentials:true,
      extraHeaders:{
        Authorization: `Bearer ${token}`,
      },
      transports:['websocket', 'polling', 'webtransport'],
      path:'/chat',
      
    },
    
    ) 
    setSocket(sc)
    sc.on('message', (msgObj:ImsgObj) => {
      setMessages((prev) => [...prev, msgObj]); 
      setLoading(isLoading)
    });
    sc.on('userJoined', (userInfo) => {
      setJoinedUserList(userInfo.userList);
    })
    sc.on('participants', (p) => {
      setParticapants(p.participant);
    })

    return () => {
      sc.disconnect();
    };
  
  }, [])

  const setUName = () => {                  //✅사용자의 아이디 고객과 상담 채팅 구현
    const {chattingRoomId} =  getValues()
    console.log(chattingRoomId)
    sc!.emit('joinRoom', { userName: userId, roomId: chattingRoomId } )
  }
  let fileUrl: string = '';
  const sendMessage = async () => {
    const {chattingRoomId} =  getValues()
    try {
      if (DraggedFile.length !== 0) {
        setLoading(true);
        const actualFile = DraggedFile[0]
        const formBody = new FormData();
        formBody.append('file', actualFile)
        const { url: ImageUrl } = await ( 
          await fetch(`${BASE_PATH}/upload/`, {
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
       sc!.emit('message', [`${userId}:` + "  " + inputMessage, fileUrl, chattingRoomId]); 
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
         sc!.emit('message', [`${userId}:`+ inputMessage, fileUrl, chattingRoomId]); 
         setInputMessage('');
         setDragFile([]);
       }
     }
    } catch (e) {}
  };

  const handleOnCheck = (event:any) => {
    const isChecked = event.target.checked;
    setDarkAtom(isChecked)
  } 
  const onDrop = useCallback( (acceptedFiles:any) => {
  // 파일이 드롭됐을 때의 로직을 처리합니다.
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
  return (
  <StreamingWrapper>
    <Helmet>
      <title>Trader | A/S </title>       
    </Helmet>
    <form>
      <RoomId>
        <label>채팅 방의 아디를 입력하세요.</label>
        <input
          {...register('chattingRoomId')}  
          type='text'
        />
      </RoomId>
    </form> 
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
    {isLoading ? ( <Loading />) : null
    }
  
  </StreamingWrapper>
  
  )
} 









